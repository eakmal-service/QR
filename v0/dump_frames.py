import glob
import os

base_path = "/Users/hanzalaqureshi/Desktop/work/QR/QR/v0/Frames /"
mr_qr_path = os.path.join(base_path, "MR. QR")
std_path = os.path.join(base_path, "standerd frames ")

print(f"Searching in {mr_qr_path}")
mr_qr_files = glob.glob(os.path.join(mr_qr_path, "*.svg"))
print(f"Searching in {std_path}")
std_files = glob.glob(os.path.join(std_path, "*.svg"))

print(f"Found {len(mr_qr_files)} Mr QR files")
print(f"Found {len(std_files)} Standard files")

# Determine optimal batch size or just dump all
# Since output might be huge, maybe I should just list them and read one by one?
# No, I want to capture them.
# Let's generate a TS component file directly?
# That would be cool.

# Let's write to a file "all_frames.xml" with custom delimiters.
with open("all_frames_dump.txt", "w") as outfile:
    for f in mr_qr_files:
        name = os.path.basename(f)
        with open(f, 'r') as infile:
            content = infile.read()
            outfile.write(f"--- START MR_QR {name} ---\n")
            outfile.write(content + "\n")
            outfile.write(f"--- END MR_QR {name} ---\n")

    for f in std_files:
        name = os.path.basename(f)
        with open(f, 'r') as infile:
            content = infile.read()
            outfile.write(f"--- START STANDARD {name} ---\n")
            outfile.write(content + "\n")
            outfile.write(f"--- END STANDARD {name} ---\n")

print("Dumped to all_frames_dump.txt")
