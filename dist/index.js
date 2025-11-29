import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import fs from "fs/promises";
import { exec } from "child_process";
import { promisify } from "util";
import axios from "axios";
import { glob } from "glob";
const execAsync = promisify(exec);
// n8n configuration
const N8N_BASE_URL = "http://192.168.50.246:5678";
const N8N_API_URL = `${N8N_BASE_URL}/api/v1`;
// Define all available tools
const TOOLS = [
    {
        name: "read_file",
        description: "Read the complete contents of a file from the filesystem",
        inputSchema: {
            type: "object",
            properties: {
                path: {
                    type: "string",
                    description: "Absolute or relative path to the file",
                },
            },
            required: ["path"],
        },
    },
    {
        name: "write_file",
        description: "Write content to a file, creating it if it doesn't exist or overwriting if it does",
        inputSchema: {
            type: "object",
            properties: {
                path: {
                    type: "string",
                    description: "Absolute or relative path to the file",
                },
                content: {
                    type: "string",
                    description: "Content to write to the file",
                },
            },
            required: ["path", "content"],
        },
    },
    {
        name: "list_directory",
        description: "List all files and directories in a given path",
        inputSchema: {
            type: "object",
            properties: {
                path: {
                    type: "string",
                    description: "Directory path to list",
                },
            },
            required: ["path"],
        },
    },
    {
        name: "create_directory",
        description: "Create a new directory (and parent directories if needed)",
        inputSchema: {
            type: "object",
            properties: {
                path: {
                    type: "string",
                    description: "Directory path to create",
                },
            },
            required: ["path"],
        },
    },
    {
        name: "delete_file",
        description: "Delete a file or directory",
        inputSchema: {
            type: "object",
            properties: {
                path: {
                    type: "string",
                    description: "Path to delete",
                },
                recursive: {
                    type: "boolean",
                    description: "If true, delete directories recursively",
                },
            },
            required: ["path"],
        },
    },
    {
        name: "search_files",
        description: "Search for files matching a glob pattern",
        inputSchema: {
            type: "object",
            properties: {
                pattern: {
                    type: "string",
                    description: "Glob pattern (e.g., '**/*.js', 'src/**/*.ts')",
                },
                cwd: {
                    type: "string",
                    description: "Working directory for the search",
                },
            },
            required: ["pattern"],
        },
    },
    {
        name: "execute_command",
        description: "Execute a shell command (PowerShell on Windows)",
        inputSchema: {
            type: "object",
            properties: {
                command: {
                    type: "string",
                    description: "Command to execute",
                },
                cwd: {
                    type: "string",
                    description: "Working directory for command execution",
                },
            },
            required: ["command"],
        },
    },
    {
        name: "get_file_stats",
        description: "Get detailed information about a file or directory",
        inputSchema: {
            type: "object",
            properties: {
                path: {
                    type: "string",
                    description: "Path to get stats for",
                },
            },
            required: ["path"],
        },
    },
    {
        name: "move_file",
        description: "Move or rename a file or directory",
        inputSchema: {
            type: "object",
            properties: {
                source: {
                    type: "string",
                    description: "Source path",
                },
                destination: {
                    type: "string",
                    description: "Destination path",
                },
            },
            required: ["source", "destination"],
        },
    },
    {
        name: "n8n_list_workflows",
        description: "List all workflows from the n8n instance",
        inputSchema: {
            type: "object",
            properties: {
                apiKey: {
                    type: "string",
                    description: "n8n API key (optional if configured)",
                },
            },
        },
    },
    {
        name: "n8n_get_workflow",
        description: "Get details of a specific workflow",
        inputSchema: {
            type: "object",
            properties: {
                workflowId: {
                    type: "string",
                    description: "Workflow ID",
                },
                apiKey: {
                    type: "string",
                    description: "n8n API key (optional if configured)",
                },
            },
            required: ["workflowId"],
        },
    },
    {
        name: "n8n_activate_workflow",
        description: "Activate a workflow",
        inputSchema: {
            type: "object",
            properties: {
                workflowId: {
                    type: "string",
                    description: "Workflow ID",
                },
                apiKey: {
                    type: "string",
                    description: "n8n API key (optional if configured)",
                },
            },
            required: ["workflowId"],
        },
    },
    {
        name: "n8n_deactivate_workflow",
        description: "Deactivate a workflow",
        inputSchema: {
            type: "object",
            properties: {
                workflowId: {
                    type: "string",
                    description: "Workflow ID",
                },
                apiKey: {
                    type: "string",
                    description: "n8n API key (optional if configured)",
                },
            },
            required: ["workflowId"],
        },
    },
    {
        name: "n8n_execute_workflow",
        description: "Manually execute a workflow",
        inputSchema: {
            type: "object",
            properties: {
                workflowId: {
                    type: "string",
                    description: "Workflow ID",
                },
                data: {
                    type: "object",
                    description: "Input data for the workflow",
                },
                apiKey: {
                    type: "string",
                    description: "n8n API key (optional if configured)",
                },
            },
            required: ["workflowId"],
        },
    },
    {
        name: "n8n_list_executions",
        description: "List workflow executions",
        inputSchema: {
            type: "object",
            properties: {
                workflowId: {
                    type: "string",
                    description: "Filter by workflow ID (optional)",
                },
                apiKey: {
                    type: "string",
                    description: "n8n API key (optional if configured)",
                },
            },
        },
    },
];
// Tool handlers
async function handleReadFile(args) {
    const content = await fs.readFile(args.path, "utf-8");
    return content;
}
async function handleWriteFile(args) {
    await fs.writeFile(args.path, args.content, "utf-8");
    return `Successfully wrote to ${args.path}`;
}
async function handleListDirectory(args) {
    const entries = await fs.readdir(args.path, { withFileTypes: true });
    const formatted = entries.map((entry) => {
        const type = entry.isDirectory() ? "[DIR]" : "[FILE]";
        return `${type} ${entry.name}`;
    });
    return formatted.join("\n");
}
async function handleCreateDirectory(args) {
    await fs.mkdir(args.path, { recursive: true });
    return `Successfully created directory ${args.path}`;
}
async function handleDeleteFile(args) {
    if (args.recursive) {
        await fs.rm(args.path, { recursive: true, force: true });
    }
    else {
        await fs.unlink(args.path);
    }
    return `Successfully deleted ${args.path}`;
}
async function handleSearchFiles(args) {
    const files = await glob(args.pattern, { cwd: args.cwd || process.cwd() });
    return files.join("\n");
}
async function handleExecuteCommand(args) {
    const { stdout, stderr } = await execAsync(args.command, {
        cwd: args.cwd || process.cwd(),
        shell: "powershell.exe",
    });
    return stdout || stderr;
}
async function handleGetFileStats(args) {
    const stats = await fs.stat(args.path);
    return JSON.stringify({
        size: stats.size,
        isFile: stats.isFile(),
        isDirectory: stats.isDirectory(),
        created: stats.birthtime,
        modified: stats.mtime,
        accessed: stats.atime,
    }, null, 2);
}
async function handleMoveFile(args) {
    await fs.rename(args.source, args.destination);
    return `Successfully moved ${args.source} to ${args.destination}`;
}
// n8n API helpers
function getN8nHeaders(apiKey) {
    const headers = {
        "Content-Type": "application/json",
    };
    if (apiKey) {
        headers["X-N8N-API-KEY"] = apiKey;
    }
    return headers;
}
async function handleN8nListWorkflows(args) {
    const response = await axios.get(`${N8N_API_URL}/workflows`, {
        headers: getN8nHeaders(args.apiKey),
    });
    return JSON.stringify(response.data, null, 2);
}
async function handleN8nGetWorkflow(args) {
    const response = await axios.get(`${N8N_API_URL}/workflows/${args.workflowId}`, {
        headers: getN8nHeaders(args.apiKey),
    });
    return JSON.stringify(response.data, null, 2);
}
async function handleN8nActivateWorkflow(args) {
    const response = await axios.patch(`${N8N_API_URL}/workflows/${args.workflowId}`, { active: true }, { headers: getN8nHeaders(args.apiKey) });
    return `Workflow ${args.workflowId} activated successfully`;
}
async function handleN8nDeactivateWorkflow(args) {
    const response = await axios.patch(`${N8N_API_URL}/workflows/${args.workflowId}`, { active: false }, { headers: getN8nHeaders(args.apiKey) });
    return `Workflow ${args.workflowId} deactivated successfully`;
}
async function handleN8nExecuteWorkflow(args) {
    const response = await axios.post(`${N8N_API_URL}/workflows/${args.workflowId}/execute`, args.data || {}, { headers: getN8nHeaders(args.apiKey) });
    return JSON.stringify(response.data, null, 2);
}
async function handleN8nListExecutions(args) {
    const params = args.workflowId ? { workflowId: args.workflowId } : {};
    const response = await axios.get(`${N8N_API_URL}/executions`, {
        headers: getN8nHeaders(args.apiKey),
        params,
    });
    return JSON.stringify(response.data, null, 2);
}
// Main server setup
const server = new Server({
    name: "chatgpt-mcp-server",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
// Register tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: TOOLS };
});
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
        const { name, arguments: args } = request.params;
        switch (name) {
            case "read_file":
                return { content: [{ type: "text", text: await handleReadFile(args) }] };
            case "write_file":
                return { content: [{ type: "text", text: await handleWriteFile(args) }] };
            case "list_directory":
                return { content: [{ type: "text", text: await handleListDirectory(args) }] };
            case "create_directory":
                return { content: [{ type: "text", text: await handleCreateDirectory(args) }] };
            case "delete_file":
                return { content: [{ type: "text", text: await handleDeleteFile(args) }] };
            case "search_files":
                return { content: [{ type: "text", text: await handleSearchFiles(args) }] };
            case "execute_command":
                return { content: [{ type: "text", text: await handleExecuteCommand(args) }] };
            case "get_file_stats":
                return { content: [{ type: "text", text: await handleGetFileStats(args) }] };
            case "move_file":
                return { content: [{ type: "text", text: await handleMoveFile(args) }] };
            case "n8n_list_workflows":
                return { content: [{ type: "text", text: await handleN8nListWorkflows(args) }] };
            case "n8n_get_workflow":
                return { content: [{ type: "text", text: await handleN8nGetWorkflow(args) }] };
            case "n8n_activate_workflow":
                return { content: [{ type: "text", text: await handleN8nActivateWorkflow(args) }] };
            case "n8n_deactivate_workflow":
                return { content: [{ type: "text", text: await handleN8nDeactivateWorkflow(args) }] };
            case "n8n_execute_workflow":
                return { content: [{ type: "text", text: await handleN8nExecuteWorkflow(args) }] };
            case "n8n_list_executions":
                return { content: [{ type: "text", text: await handleN8nListExecutions(args) }] };
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
    catch (error) {
        return {
            content: [{ type: "text", text: `Error: ${error.message}` }],
            isError: true,
        };
    }
});
// Start the server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map