import Link from "next/link";

export default function TestPage() {
    const qrCodes = [
        { id: "test-qr-1", name: "The Coffee House", summary: "Premium coffee and pastries" },
        { id: "test-qr-2", name: "Tech Repair Shop", summary: "Fast and reliable repair services" },
        { id: "test-qr-3", name: "Yoga Studio", summary: "Peaceful yoga classes" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Smart Auto-Review Test Page
                </h1>
                <p className="text-gray-600 mb-8">
                    Click on any QR code below to test the auto-review feature
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                    {qrCodes.map((qr) => (
                        <Link
                            key={qr.id}
                            href={`/visit/${qr.id}`}
                            className="block bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 border-2 border-transparent hover:border-blue-500"
                        >
                            <div className="text-center">
                                <div className="text-6xl mb-4">📱</div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">
                                    {qr.name}
                                </h2>
                                <p className="text-sm text-gray-600 mb-4">{qr.summary}</p>
                                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-semibold">
                                    Test QR Code
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-12 bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        How It Works
                    </h2>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                        <li>Click on a QR code above</li>
                        <li>Wait for AI to generate a unique review (2-5 seconds)</li>
                        <li>Review will appear in random language (English/Hindi/Gujarati/Hinglish)</li>
                        <li>You can edit the review if needed</li>
                        <li>Click "Copy to Clipboard" to copy the text</li>
                        <li>Click "Submit Review" to save it to the database</li>
                    </ol>
                </div>

                <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-yellow-900 mb-2">
                        ⚠️ Setup Required
                    </h3>
                    <p className="text-yellow-800">
                        Make sure you've added your <code className="bg-yellow-200 px-2 py-1 rounded">GEMINI_API_KEY</code> to the{" "}
                        <code className="bg-yellow-200 px-2 py-1 rounded">.env</code> file.
                        See <code className="bg-yellow-200 px-2 py-1 rounded">SETUP_INSTRUCTIONS.md</code> for details.
                    </p>
                </div>
            </div>
        </div>
    );
}
