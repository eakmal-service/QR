
import os
import re
import math
import xml.etree.ElementTree as ET

# Configuration
FRAMES_DIR = "Frames "  # Note the space at the end
OUTPUT_FILE = "components/generated-qr-frames.tsx"

def parse_style(style_str):
    """
    Parses a CSS style content string into a dictionary of class definitions.
    Returns: {className: {prop: value, ...}}
    """
    definitions = {}
    # Remove newlines and excess whitespace
    style_str = re.sub(r'\s+', ' ', style_str).strip()
    # Find all class definitions: .className { ... }
    matches = re.finditer(r'\.([\w-]+)\s*\{([^}]+)\}', style_str)
    for match in matches:
        cls_name = match.group(1)
        rules_str = match.group(2)
        rules = {}
        for rule in rules_str.split(';'):
            if ':' in rule:
                prop, val = rule.split(':', 1)
                rules[prop.strip()] = val.strip()
        definitions[cls_name] = rules
    return definitions

def is_color_light(color_str):
    """
    Heuristic to determine if a color is 'light' (potential QR background).
    Supports hex (#fff, #ffffff), rgb, and names (white, silver).
    """
    color_str = str(color_str).lower()
    
    if color_str in ['white', '#fff', '#ffffff']:
        return True
    
    # Check hex colors
    match = re.match(r'#([0-9a-f]{6})', color_str)
    if match:
        r, g, b = tuple(int(match.group(1)[i:i+2], 16) for i in (0, 2, 4))
        # Simple luminance or just check if it's very bright
        return (r > 240 and g > 240 and b > 240)
    
    match_short = re.match(r'#([0-9a-f]{3})', color_str)
    if match_short:
        r, g, b = tuple(int(c*2, 16) for c in match_short.group(1))
        return (r > 240 and g > 240 and b > 240)
        
    return False

class PathParser:
    """
    Simple SVG Path Parser to estimate bounding box.
    Uses control points for Bezier curves which provides a 'safe' bounding box (convex hull property).
    """
    def __init__(self, d):
        self.d = d
        self.commands = re.findall(r'([a-zA-Z])|([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)', d)
        self.current_pos = (0, 0)
        self.min_x = float('inf')
        self.min_y = float('inf')
        self.max_x = float('-inf')
        self.max_y = float('-inf')
        self.points = []

    def add_point(self, x, y):
        self.points.append((x, y))
        self.min_x = min(self.min_x, x)
        self.min_y = min(self.min_y, y)
        self.max_x = max(self.max_x, x)
        self.max_y = max(self.max_y, y)

    def parse(self):
        # Flatten the regex matches
        tokens = []
        for cmd, num in self.commands:
            if cmd: tokens.append(cmd)
            if num: tokens.append(float(num))
        
        idx = 0
        start_pos = (0, 0) # Track path start for Z command
        
        while idx < len(tokens):
            cmd = tokens[idx]
            idx += 1
            
            # Helper to get N arguments
            def get_args(n):
                nonlocal idx
                args = []
                for _ in range(n):
                    if idx < len(tokens) and isinstance(tokens[idx], (int, float)):
                        args.append(tokens[idx])
                        idx += 1
                    else:
                        break
                return args

            if cmd == 'M': # Move abs
                args = get_args(2)
                if len(args) == 2:
                    self.current_pos = (args[0], args[1])
                    start_pos = self.current_pos
                    self.add_point(*self.current_pos)
                    # Use implicit L/l logic if more args follow? SVG spec says implicit L
                    # For bbox we just consume them as points
                    while True:
                        implicit_args = get_args(2)
                        if len(implicit_args) == 2:
                            self.current_pos = (implicit_args[0], implicit_args[1])
                            self.add_point(*self.current_pos)
                        else:
                            break

            elif cmd == 'm': # Move rel
                args = get_args(2)
                if len(args) == 2:
                    self.current_pos = (self.current_pos[0] + args[0], self.current_pos[1] + args[1])
                    start_pos = self.current_pos
                    self.add_point(*self.current_pos)
                    while True:
                        implicit_args = get_args(2)
                        if len(implicit_args) == 2:
                            self.current_pos = (self.current_pos[0] + implicit_args[0], self.current_pos[1] + implicit_args[1])
                            self.add_point(*self.current_pos)
                        else:
                            break

            elif cmd == 'L': # Line abs
                while True:
                    args = get_args(2)
                    if len(args) == 2:
                        self.current_pos = (args[0], args[1])
                        self.add_point(*self.current_pos)
                    else: break

            elif cmd == 'l': # Line rel
                while True:
                    args = get_args(2)
                    if len(args) == 2:
                        self.current_pos = (self.current_pos[0] + args[0], self.current_pos[1] + args[1])
                        self.add_point(*self.current_pos)
                    else: break

            elif cmd == 'H': # Horizontal abs
                while True:
                    args = get_args(1)
                    if len(args) == 1:
                        self.current_pos = (args[0], self.current_pos[1])
                        self.add_point(*self.current_pos)
                    else: break

            elif cmd == 'h': # Horizontal rel
                while True:
                    args = get_args(1)
                    if len(args) == 1:
                        self.current_pos = (self.current_pos[0] + args[0], self.current_pos[1])
                        self.add_point(*self.current_pos)
                    else: break

            elif cmd == 'V': # Vertical abs
                while True:
                    args = get_args(1)
                    if len(args) == 1:
                        self.current_pos = (self.current_pos[0], args[0])
                        self.add_point(*self.current_pos)
                    else: break

            elif cmd == 'v': # Vertical rel
                while True:
                    args = get_args(1)
                    if len(args) == 1:
                        self.current_pos = (self.current_pos[0], self.current_pos[1] + args[0])
                        self.add_point(*self.current_pos)
                    else: break
            
            # Bezier Curves - we add control points and end points to bbox
            elif cmd == 'C': # Cubic abs (x1 y1 x2 y2 x y)
                while True:
                    args = get_args(6)
                    if len(args) == 6:
                        # add control points
                        self.add_point(args[0], args[1])
                        self.add_point(args[2], args[3])
                        # add dest
                        self.current_pos = (args[4], args[5])
                        self.add_point(*self.current_pos)
                    else: break

            elif cmd == 'c': # Cubic rel
                while True:
                    args = get_args(6)
                    if len(args) == 6:
                        cx, cy = self.current_pos
                        self.add_point(cx + args[0], cy + args[1])
                        self.add_point(cx + args[2], cy + args[3])
                        self.current_pos = (cx + args[4], cy + args[5])
                        self.add_point(*self.current_pos)
                    else: break

            elif cmd == 'S': # Smooth Cubic abs (x2 y2 x y)
                while True:
                    args = get_args(4)
                    if len(args) == 4:
                        self.add_point(args[0], args[1])
                        self.current_pos = (args[2], args[3])
                        self.add_point(*self.current_pos)
                    else: break

            elif cmd == 's': # Smooth Cubic rel
                while True:
                    args = get_args(4)
                    if len(args) == 4:
                        cx, cy = self.current_pos
                        self.add_point(cx + args[0], cy + args[1])
                        self.current_pos = (cx + args[2], cy + args[3])
                        self.add_point(*self.current_pos)
                    else: break
                    
            elif cmd == 'Q': # Quad abs (x1 y1 x y)
                while True:
                    args = get_args(4)
                    if len(args) == 4:
                        self.add_point(args[0], args[1])
                        self.current_pos = (args[2], args[3])
                        self.add_point(*self.current_pos)
                    else: break

            elif cmd == 'q': # Quad rel
                while True:
                    args = get_args(4)
                    if len(args) == 4:
                        cx, cy = self.current_pos
                        self.add_point(cx + args[0], cy + args[1])
                        self.current_pos = (cx + args[2], cy + args[3])
                        self.add_point(*self.current_pos)
                    else: break

            elif cmd == 'Z' or cmd == 'z':
                self.current_pos = start_pos
                
        if self.min_x == float('inf'): return None
        return (self.min_x, self.min_y, self.max_x - self.min_x, self.max_y - self.min_y)

def get_qr_placement(root, viewBox, style_map=None, is_mr_qr=False, frame_id=None):
    """
    Scans the SVG root for a lighter/white element that could serve as the QR code background.
    Returns (left_percent, top_percent, width_percent, height_percent) or None.
    """
    if style_map is None: style_map = {}
    
    # 1. Parse ViewBox
    vb_parts = [float(x) for x in viewBox.split()]
    if len(vb_parts) == 4:
        vb_w, vb_h = vb_parts[2], vb_parts[3]
    else:
        vb_w, vb_h = 200, 200 # Fallback default

    # 2. Find Candidates
    candidates = [] # (element, area, diff_from_square)

    def get_fill(elem):
        # 1. Inline fill
        fill = elem.attrib.get('fill')
        if fill: return fill
        
        # 2. Style attribute
        style = elem.attrib.get('style')
        if style and 'fill' in style:
            match = re.search(r'fill:\s*([^;]+)', style)
            if match: return match.group(1)
            
        # 3. Class lookup
        cls = elem.attrib.get('class')
        if cls and cls in style_map:
            return style_map[cls].get('fill')
            
        return None

    def process_element(elem):
        fill_color = get_fill(elem)
        
        if not fill_color: return
        
        if is_color_light(fill_color):
            bbox = None
            tag = elem.tag.replace('{http://www.w3.org/2000/svg}', '')
            
            if tag == 'rect':
                x = float(elem.attrib.get('x', 0))
                y = float(elem.attrib.get('y', 0))
                w = float(elem.attrib.get('width', 0))
                h = float(elem.attrib.get('height', 0))
                bbox = (x, y, w, h)
                
            elif tag == 'path':
                d = elem.attrib.get('d', '')
                parser = PathParser(d)
                bbox = parser.parse()
            
            if bbox:
                x, y, w, h = bbox
                # Filter out tiny specks or full background
                # Require at least 15% of the viewbox dimension
                if w < vb_w * 0.15 or h < vb_h * 0.15: return 
                if w > vb_w * 0.95 and h > vb_h * 0.95: return # Likely just background
                
                # Check aspect ratio
                aspect = w / h if h != 0 else 0
                diff_square = abs(1 - aspect)
                
                candidates.append({
                    'bbox': bbox,
                    'area': w * h,
                    'diff_square': diff_square,
                    'color': fill_color
                })

    for elem in root.iter():
        process_element(elem)
        
    # 3. Select Best Candidate
    if not candidates:
        return None
        
    # Sort: Primary by "Diff from Square", secondary by Area (largest first)
    # Actually, we want something that is roughly square.
    # Let's filter for aspect ratio between 0.8 and 1.2
    valid_candidates = [c for c in candidates if 0.8 < (c['bbox'][2]/c['bbox'][3]) < 1.2]
    
    if not valid_candidates:
        # Fallback to just largest area?
        valid_candidates = candidates
        
    # Pick largest area among valid candidates
    best = max(valid_candidates, key=lambda c: c['area'])
    
    x, y, w, h = best['bbox']
    
    # Apply padding for Mr. QR frames to prevent corner overflow
    if is_mr_qr:
        # Default generous scale for "Mr. QR" frames to maximize size (like Scan Me frames)
        # Using 1.00 means fitting exactly to the detected white bounding box.
        # This removes any white gap between the QR and the frame border.
        padding_scale = 1.00 
        
        # Specific overrides for tricky shapes
        if frame_id == '47': # Syringe - needs more padding for rounded corners
            padding_scale = 0.85
        elif frame_id == '50': # Thumbs Up - square head, can be nearly full
            padding_scale = 1.00
            
        center_x = x + w/2

        center_y = y + h/2
        new_w = w * padding_scale
        new_h = h * padding_scale
        x = center_x - new_w/2
        y = center_y - new_h/2
        w = new_w
        h = new_h
    
    # Calculate Percentages
    l_p = (x / vb_w) * 100
    t_p = (y / vb_h) * 100
    w_p = (w / vb_w) * 100
    h_p = (h / vb_h) * 100
    
    return (l_p, t_p, w_p, h_p)


def process_frames():
    imports = []
    frame_definitions = []
    
    # Start the file
    comp_file_content = """import React from 'react';

/**
 * GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated by generate_frames_components.py
 */

"""

    ids_seen = set()

    for root_dir, dirs, files in os.walk(FRAMES_DIR):
        category = "Basic"
        if "MR. QR" in root_dir:
            category = "Mr. QR"
        elif "standerd frames" in root_dir:
            category = "Standard"
            
        for file in files:
            if file.endswith(".svg"):
                # Unique ID based on filename
                frame_label = os.path.splitext(file)[0]
                
                # Sanitize ID
                frame_id = "frame" + re.sub(r'[^a-zA-Z0-9]', '', frame_label).lower()
                if frame_id in ids_seen: continue
                ids_seen.add(frame_id)
                
                component_name = "Frame" + re.sub(r'[^a-zA-Z0-9]', '', frame_label).capitalize()
                
                file_path = os.path.join(root_dir, file)
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        svg_content = f.read()
                        
                    # Parse XML
                    # Remove XML declaration if present
                    svg_content = re.sub(r'<\?xml.*?\?>', '', svg_content)
                    svg_content = re.sub(r'<!DOCTYPE.*?>', '', svg_content)
                    # Remove comments
                    svg_content = re.sub(r'<!--.*?-->', '', svg_content, flags=re.DOTALL)
                    
                    try:
                        # Register namespace to avoid ns0 prefixes
                        ET.register_namespace('', "http://www.w3.org/2000/svg")
                        xml_root = ET.fromstring(svg_content)
                    except ET.ParseError:
                        print(f"Error parsing XML for {file}")
                        continue
                        
                    # Extract ViewBox
                    viewBox = xml_root.attrib.get('viewBox', '0 0 200 200')
                    vb_parts = [float(x) for x in viewBox.split()]
                    if len(vb_parts) == 4:
                        vb_w, vb_h = vb_parts[2], vb_parts[3]
                    else:
                        vb_w, vb_h = 200, 200
                    
                    # EXTRACT AND PARSE STYLES
                    style_map = {}
                    # We need to find the style element AND its parent to remove it
                    style_elem = None
                    style_parent = None
                    
                    # Iterate to find style and its parent
                    for parent in xml_root.iter():
                        for child in parent:
                            if child.tag.endswith('style'):
                                style_elem = child
                                style_parent = parent
                                break
                        if style_elem is not None: break

                        
                    # Also check root children manually if not found by iter (iter includes root usually but good to be safe)
                    # Actually root.iter() includes root! But root isn't a child of anyone in this context (except logical None)
                    # So if style is direct child of root, 'parent' loop handles it (parent=xml_root).
                    
                    if style_elem is not None and style_elem.text:
                        style_map = parse_style(style_elem.text)
                        if style_parent is not None:

                            style_parent.remove(style_elem)
                    


                    
                    # GET QR PLACEMENT
                    placement = get_qr_placement(xml_root, viewBox, style_map, is_mr_qr=(category == "Mr. QR"), frame_id=frame_label)
                    
                    if placement:
                        l, t, w, h = placement
                        qr_style = f"left: '{l:.2f}%', top: '{t:.2f}%', width: '{w:.2f}%', height: '{h:.2f}%'"
                    else:
                        qr_style = "left: '20%', top: '20%', width: '60%', height: '60%'"

                    # INLINE STYLES using ElementTree
                    def inline_styles(elem):
                        # Get class
                        cls = elem.get('class')
                        if cls and cls in style_map:
                            rules = style_map[cls]
                            for prop, val in rules.items():
                                # Only set if not already set? Or overwrite? 
                                # Inline style usually overrides class, so if attribute exists, maybe keep it?
                                # But SVG attributes like 'fill' are presentation attributes.
                                # CSS overrides attributes. So we should Overwrite attributes with CSS values.
                                elem.set(prop, val)
                            # Remove class attribute
                            del elem.attrib['class']
                        
                        # Process children
                        for child in elem:
                            inline_styles(child)

                    inline_styles(xml_root)

                    # Serialize back to string
                    # method='xml' ensures we get a valid SVG string
                    svg_body = ET.tostring(xml_root, encoding='unicode', method='xml')
                    
                    # ET.tostring includes the root <svg> tag. We want to construct our own to control width/height/props.
                    # Or we can just modify the root attributes and print it!
                    # BUT, regex replacements for camelCase are easier on a string.
                    
                    # Let's fix attributes on root first
                    xml_root.set('width', '100%')
                    xml_root.set('height', '100%')
                    xml_root.set('preserveAspectRatio', 'xMidYMid meet')
                    # Ensure xmlns is correct if missing (though register_namespace helps)
                    # xml_root.set('xmlns', "http://www.w3.org/2000/svg") 
                    
                    svg_content_final = ET.tostring(xml_root, encoding='unicode', method='xml')
                    
                    # Remove "ns0:" prefixes if they crept in (sometimes happens)
                    svg_content_final = re.sub(r'ns0:', '', svg_content_final)
                    svg_content_final = re.sub(r':ns0', '', svg_content_final)
                    
                    # CAMELCASE ATTRIBUTES (React Compatibility)
                    subs = [
                        ('xmlns:xlink', 'xmlnsXlink'),
                        ('xml:space', 'xmlSpace'),
                        ('stroke-width', 'strokeWidth'),
                        ('stroke-linecap', 'strokeLinecap'),
                        ('stroke-linejoin', 'strokeLinejoin'),
                        ('fill-rule', 'fillRule'),
                        ('clip-rule', 'clipRule'),
                        ('stroke-miterlimit', 'strokeMiterlimit'),
                        ('stop-color', 'stopColor'),
                        ('stop-opacity', 'stopOpacity'),
                        ('class=', 'className=') # attributes not caught by style inlining? (e.g. unused classes)
                    ]
                    for old, new in subs:
                        svg_content_final = svg_content_final.replace(old, new)

                    comp_file_content += f"""
export function {component_name}({{ children }}: any) {{
    return (
        <div className="relative w-full flex items-center justify-center" style={{{{ aspectRatio: '{vb_w}/{vb_h}' }}}}>
            <div className="absolute inset-0 w-full h-full pointer-events-none [&>svg]:w-full [&>svg]:h-full">
                {svg_content_final}
            </div>
            <div className="absolute z-10 flex items-center justify-center overflow-hidden" style={{{{ {qr_style} }}}}>
                {{children}}
            </div>
        </div>
    );
}}
"""
                    frame_definitions.append(f"{{ id: '{frame_id}', label: '{frame_label}', category: '{category}', component: {component_name} }}")
                    
                except Exception as e:
                    print(f"Error processing {file}: {e}")

    # Sort frames by ID for consistency
    frame_definitions.sort()
    
    frames_list_str = ",\n".join(frame_definitions)
    comp_file_content += f"""
export const GENERATED_FRAMES = [
{frames_list_str}
];
"""

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(comp_file_content)
    
    print(f"Successfully generated {len(frame_definitions)} frames into {OUTPUT_FILE}")

if __name__ == "__main__":
    process_frames()
