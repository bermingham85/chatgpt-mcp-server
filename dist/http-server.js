import express from "express";
import cors from "cors";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
// SSE endpoint for ChatGPT
app.get("/sse", (req, res) => {
    console.log("ChatGPT connected to MCP server");
    // Set up SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    // Spawn the MCP server process
    const mcpServerPath = path.join(__dirname, "index.js");
    const mcpProcess = spawn("node", [mcpServerPath], {
        stdio: ["pipe", "pipe", "pipe"],
    });
    // Forward MCP server output to SSE
    mcpProcess.stdout.on("data", (data) => {
        const message = data.toString();
        res.write(`data: ${JSON.stringify({ type: "message", content: message })}\n\n`);
    });
    mcpProcess.stderr.on("data", (data) => {
        console.error("MCP Server:", data.toString());
    });
    // Handle incoming SSE messages from ChatGPT
    req.on("data", (chunk) => {
        mcpProcess.stdin.write(chunk);
    });
    // Cleanup on disconnect
    req.on("close", () => {
        console.log("ChatGPT disconnected");
        mcpProcess.kill();
        res.end();
    });
    mcpProcess.on("error", (error) => {
        console.error("MCP Process error:", error);
        res.write(`data: ${JSON.stringify({ type: "error", message: error.message })}\n\n`);
    });
    mcpProcess.on("exit", (code) => {
        console.log(`MCP Process exited with code ${code}`);
        res.end();
    });
});
// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "ok", server: "chatgpt-mcp-server" });
});
// Info endpoint
app.get("/", (req, res) => {
    res.json({
        name: "ChatGPT MCP Server",
        version: "1.0.0",
        endpoints: {
            sse: "/sse - Server-Sent Events endpoint for ChatGPT",
            health: "/health - Health check",
        },
        capabilities: [
            "File system operations (read, write, list, delete, search)",
            "Directory management",
            "Command execution (PowerShell)",
            "n8n workflow management",
            "n8n workflow execution",
        ],
    });
});
app.listen(PORT, () => {
    console.log(`🚀 ChatGPT MCP Server running on http://localhost:${PORT}`);
    console.log(`📡 SSE Endpoint: http://localhost:${PORT}/sse`);
    console.log(`🔗 n8n Instance: http://192.168.50.246:5678`);
    console.log(`\nUse this URL in ChatGPT: http://localhost:${PORT}/sse`);
});
//# sourceMappingURL=http-server.js.map