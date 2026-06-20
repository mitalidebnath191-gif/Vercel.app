export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body;
    // Vercel er Environment Variable theke secure bhabe key ta read korbe
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'OpenRouter API Key missing in Vercel settings.' });
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "nvidia/nemotron-3-super-120b-a12b:free",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 300
            })
        });

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || "No reply from AI.";
        return res.status(200).json({ reply });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
                                     }
          
