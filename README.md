# ChatGPT MCP Server

Comprehensive Model Context Protocol (MCP) server that gives ChatGPT full access to your Windows machine with filesystem operations, command execution, and n8n workflow management.

## 🚀 Features

### Filesystem Operations
- **read_file**: Read file contents
- **write_file**: Create or overwrite files
- **list_directory**: List directory contents
- **create_directory**: Create directories recursively
- **delete_file**: Delete files or directories
- **search_files**: Search files using glob patterns
- **get_file_stats**: Get file metadata
- **move_file**: Move or rename files

### Command Execution
- **execute_command**: Run PowerShell commands with full output

### n8n Workflow Management
- **n8n_list_workflows**: List all workflows
- **n8n_get_workflow**: Get workflow details
- **n8n_activate_workflow**: Activate a workflow
- **n8n_deactivate_workflow**: Deactivate a workflow
- **n8n_execute_workflow**: Execute a workflow manually
- **n8n_list_executions**: View workflow execution history

## 📦 Installation

```powershell
# Navigate to the project directory
cd C:\Users\bermi\Projects\chatgpt-mcp-server

# Install dependencies
npm install

# Build the TypeScript code
npm run build
```

## 🎯 Usage

### Start the Server

```powershell
# Start the HTTP/SSE server
npm start
```

The server will start on `http://localhost:3000` by default.

### Connect ChatGPT

1. Open ChatGPT desktop app
2. Go to Settings → Features → MCP Servers
3. Click "New Connector"
4. Enter:
   - **Name**: Custom Tool (or any name)
   - **Description**: Full system access with filesystem and n8n
   - **MCP Server URL**: `http://localhost:3000/sse`
   - **Authentication**: OAuth (or None if not required)
5. Check "I understand and want to continue"
6. Click "Create"

### Test the Connection

Ask ChatGPT to:
- "List files in my Projects directory"
- "Read the contents of package.json"
- "Show me all n8n workflows"
- "Execute the command 'Get-Date' in PowerShell"

## 🔧 Configuration

### n8n API Key (Optional)

If your n8n instance requires authentication, you can either:

1. **Pass it with each call** - ChatGPT will include the API key in tool parameters
2. **Set environment variable**:
   ```powershell
   $env:N8N_API_KEY="your-api-key-here"
   npm start
   ```

### Change Port

```powershell
$env:PORT=8080
npm start
```

### n8n Instance

The server is configured to connect to: `http://192.168.50.246:5678`

To change this, edit `src/index.ts` line 18:
```typescript
const N8N_BASE_URL = "http://your-n8n-instance:port";
```

## 🛡️ Security Considerations

⚠️ **WARNING**: This server gives ChatGPT full access to:
- Your entire filesystem
- Command execution on your machine
- Your n8n workflows

**Recommendations**:
- Only run on trusted local networks
- Review all commands before ChatGPT executes them
- Consider adding authentication/authorization
- Run with limited user permissions if possible
- Monitor all operations

## 📝 Development

### Watch Mode
```powershell
npm run watch
```

### Project Structure
```
chatgpt-mcp-server/
├── src/
│   ├── index.ts          # Main MCP server (stdio-based)
│   └── http-server.ts    # HTTP/SSE wrapper for ChatGPT
├── dist/                 # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## 🔍 Troubleshooting

### ChatGPT Can't Connect
- Ensure the server is running: `npm start`
- Check the URL is exactly: `http://localhost:3000/sse`
- Verify no firewall is blocking port 3000

### n8n Commands Fail
- Verify n8n is accessible: `http://192.168.50.246:5678`
- Check if n8n API is enabled in settings
- Ensure API key is correct (if required)

### File Operations Fail
- Check file paths are correct (Windows uses backslashes)
- Verify you have permissions for the operation
- Use absolute paths when possible

## 📚 Examples

### Read a File
```
ChatGPT: "Read the file at C:\Users\bermi\Projects\hourly-autopilot-system\package.json"
```

### Create a New File
```
ChatGPT: "Create a new file called test.txt with the content 'Hello World'"
```

### List n8n Workflows
```
ChatGPT: "Show me all my n8n workflows"
```

### Execute a Command
```
ChatGPT: "Run the command 'Get-ChildItem C:\Users\bermi\Projects' in PowerShell"
```

### Search Files
```
ChatGPT: "Find all TypeScript files in the hourly-autopilot-system project"
```

## 📄 License

MIT

## 🤝 Support

For issues or questions, please check the logs in the terminal where the server is running.
