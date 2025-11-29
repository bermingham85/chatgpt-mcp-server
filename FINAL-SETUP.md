# ✅ ChatGPT MCP Server - Ready to Connect!

## 🎉 Server is Running

Your MCP server is now running with HTTPS on port 3000.

## 🔗 Connect to ChatGPT

### Step 1: Open ChatGPT Desktop App

### Step 2: Add MCP Server

1. Click on your **profile/avatar** in ChatGPT
2. Go to **Settings** → **Features** → **MCP Servers** (or similar menu)
3. Click **"New Connector"** or **"Add Server"**

### Step 3: Enter These Details

```
Name: My Computer
Description: Full system access - filesystem, commands, n8n workflows
MCP Server URL: https://localhost:3000/sse
Authentication: OAuth (or None if available)
```

### Step 4: Accept Security Warning

- ✅ Check: "I understand and want to continue"
- Click: **"Create"** or **"Add"**

ChatGPT may warn about unsafe URLs since it's a self-signed certificate. **This is expected and safe for localhost.**

## 🧪 Test the Connection

Once connected, try these commands in ChatGPT:

### Test 1: List Files
```
"List all files in C:\Users\bermi\Projects"
```

### Test 2: Read a File
```
"Read the package.json file in the chatgpt-mcp-server project"
```

### Test 3: n8n Workflows
```
"Show me all my n8n workflows"
```

### Test 4: Run a Command
```
"Run this PowerShell command: Get-Date"
```

## ⚙️ What ChatGPT Can Do

### 📁 Filesystem
- Read any file
- Write/create files
- List directories
- Search files (glob patterns)
- Move/rename files
- Delete files
- Get file stats

### 💻 Commands
- Execute any PowerShell command
- Full stdout/stderr output
- Specify working directory

### 🔄 n8n Workflows (http://192.168.50.246:5678)
- List all workflows
- Get workflow details
- Activate/deactivate workflows
- Execute workflows manually
- View execution history

## 🛑 Stop the Server

Go to the PowerShell window and press `Ctrl+C`

## 🚀 Restart the Server

```powershell
cd C:\Users\bermi\Projects\chatgpt-mcp-server
npm start
```

## 🔧 Troubleshooting

### "Connection failed" or "Unsafe URL"

This is because we're using a self-signed certificate. ChatGPT should allow you to proceed anyway. If not:

1. **Try accessing** `https://localhost:3000/health` **in your browser first**
2. **Accept the security warning** in the browser
3. **Then try connecting** in ChatGPT

### Certificate Trust Issues

Run this to trust the certificate system-wide:

```powershell
Import-Certificate -FilePath "certs\localhost.cer" -CertStoreLocation Cert:\CurrentUser\Root
```

### Port Already in Use

Change the port:

```powershell
$env:PORT=8080
npm start
```

Then use: `https://localhost:8080/sse`

### n8n Commands Don't Work

1. Verify n8n is accessible: http://192.168.50.246:5678
2. Check if n8n API is enabled in settings
3. Get an API key from n8n if required

## 📚 Available Tools

ChatGPT has access to these 15 tools:

1. `read_file` - Read file contents
2. `write_file` - Write to file
3. `list_directory` - List directory
4. `create_directory` - Create directory
5. `delete_file` - Delete file/directory
6. `search_files` - Search with glob patterns
7. `get_file_stats` - File metadata
8. `move_file` - Move/rename
9. `execute_command` - Run PowerShell
10. `n8n_list_workflows` - List workflows
11. `n8n_get_workflow` - Get workflow details
12. `n8n_activate_workflow` - Activate workflow
13. `n8n_deactivate_workflow` - Deactivate workflow
14. `n8n_execute_workflow` - Execute workflow
15. `n8n_list_executions` - List executions

## ⚠️ Security Notice

**This gives ChatGPT FULL ACCESS to your computer!**

- Review commands before execution
- Be careful with destructive operations
- Monitor what ChatGPT does
- Only use on trusted machines
- Consider the security implications

---

**Ready?** Enter this URL in ChatGPT:

# `https://localhost:3000/sse`

Happy automating! 🚀
