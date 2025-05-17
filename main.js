const {app, BrowserWindow}= require('electron')
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences:{
        nodeIntegration: true,
        contextIsolation: false, 
    }
  })

  win.loadURL('http://localhost:3000')
    win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed',()=>{
    app.quit()
})
app.on('activate',()=>{
    if(BrowserWindow.getAllWindows().length===0){
        createWindow();
    }
})