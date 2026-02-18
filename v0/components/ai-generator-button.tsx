"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { generateAIContent } from "@/app/actions/gemini";
import { toast } from "sonner";

interface AIGeneratorButtonProps {
    onContentGenerated: (content: string) => void;
    context?: string; // e.g., "email body", "sms message"
}

export function AIGeneratorButton({
    onContentGenerated,
    context = "content",
}: AIGeneratorButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setIsLoading(true);
        try {
            const generatedText = await generateAIContent(
                `Write a ${context} based on this prompt: ${prompt}`
            );
            onContentGenerated(generatedText);
            setIsOpen(false);
            setPrompt("");
            toast.success("Content generated successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate content. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-2 text-violet-400 border-violet-900/50 hover:bg-violet-900/20 hover:text-violet-300"
                >
                    <Sparkles className="w-4 h-4" />
                    Generate with AI
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4 bg-zinc-950 border-zinc-800 text-white" align="start">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h4 className="font-medium text-sm text-gray-200">
                            Generate with Gemini AI
                        </h4>
                        <p className="text-xs text-muted-foreground text-gray-400">
                            Describe what you want to generate for your {context}.
                        </p>
                    </div>
                    <Textarea
                        placeholder={`e.g., A professional ${context} for...`}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="h-24 resize-none bg-zinc-900 border-zinc-800 text-sm focus-visible:ring-violet-500"
                    />
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-white hover:bg-zinc-800"
                        >
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleGenerate}
                            disabled={!prompt.trim() || isLoading}
                            className="bg-violet-600 hover:bg-violet-700 text-white"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Generate
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
