# ChatGPT MCP Server - Quick Setup Guide

## ✅ Server is Running!

The MCP server should now be running in a new PowerShell window.

## 🔗 Connect ChatGPT

### Step 1: Open ChatGPT
Open your ChatGPT desktop application

### Step 2: Navigate to MCP Settings
- Click your profile/settings
- Go to **Features** → **MCP Servers** (or similar)
- Click **"New Connector"**

### Step 3: Enter Connection Details

Fill in the form:
- **Name**: `My Computer` (or whatever you prefer)
- **Description**: `Full system access with filesystem, commands, and n8n workflows`
- **MCP Server URL**: 
  ```
  http://localhost:3000/sse
  ```
- **Authentication**: Select **OAuth** (or **None** if that option exists)

### Step 4: Accept Risk Warning
- ✅ Check the box: "I understand and want to continue"
- Click **"Create"**

## 🎉 Test It Out!

Once connected, try these commands in ChatGPT:

### Filesystem Commands
```
"List all files in C:\Users\bermi\Projects"
"Read the file at C:\Users\bermi\Projects\chatgpt-mcp-server\package.json"
"Search for all .json files in my Projects folder"
```

### n8n Commands
```
"Show me all my n8n workflows"
"Get details of workflow ID 1"
"List recent n8n executions"
```

### PowerShell Commands
```
"Run the command: Get-Date"
"Execute: Get-Process | Select-Object -First 5"
"Run: Get-ChildItem C:\Users\bermi\Projects -Directory"
```

## 📋 What ChatGPT Can Do

### Full Filesystem Access
- Read any file on your computer
- Write/create new files
- List directories
- Search for files
- Move/rename files
- Delete files (be careful!)
- Get file metadata

### Command Execution
- Run any PowerShell command
- Execute scripts
- Check system information
- Manage processes

### n8n Integration
- List all workflows
- Get workflow details
- Activate/deactivate workflows
- Execute workflows manually
- View execution history

## 🛑 Stop the Server

To stop the MCP server:
1. Go to the PowerShell window that opened
2. Press `Ctrl+C`

## 🚀 Restart the Server

To restart later:
```powershell
cd C:\Users\bermi\Projects\chatgpt-mcp-server
npm start
```

Or use the quick start script:
```powershell
.\start.ps1
```

## ⚠️ Security Notes

**IMPORTANT**: This gives ChatGPT FULL access to your computer!

- Review commands before execution
- Be careful with file deletions
- Monitor what ChatGPT is doing
- Only use on your local, trusted machine

## 🔧 Troubleshooting

### ChatGPT says "Connection failed"
1. Check the PowerShell window - is the server running?
2. Make sure you used exactly: `http://localhost:3000/sse`
3. Try refreshing ChatGPT

### n8n commands don't work
1. Verify n8n is running at: http://192.168.50.246:5678
2. Check if n8n API is enabled
3. You might need an API key

### File operations fail
- Use full paths: `C:\Users\bermi\...`
- Check you have permissions
- Make sure the file/folder exists

## 📚 Advanced Usage

### Use with n8n API Key
If your n8n requires authentication:

```powershell
$env:N8N_API_KEY="your-api-key-here"
npm start
```

### Change the Port
```powershell
$env:PORT=8080
npm start
```
Then use: `http://localhost:8080/sse` in ChatGPT

---

**Need help?** Check the main README.md or the server logs in the PowerShell window!
