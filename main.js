const {app, BrowserWindow,Menu,Tray}= require('electron')
 const path= require('path');
 

let tray=null
const dockIcon = path.join(__dirname,'frontend','daily_data_split', 'public', 'tray_icon.png');
 const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon:dockIcon,
    webPreferences:{
        nodeIntegration: true,
        contextIsolation: false, 
    }
  })
  
win.loadFile(path.join(__dirname, 'frontend/daily_data_split/build/index.html'));    
win.webContents.openDevTools();
}
 if (process.platform === 'darwin') {
  app.dock.setIcon(dockIcon);
}

 app.whenReady().then(() => {
    tray = new Tray(dockIcon);
  tray.setToolTip('Daily Data Split');
    const template = require('./utils/menu').createTemplate(app)
  const menu=Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
    createWindow();
})

app.on('window-all-closed',()=>{
    app.quit()
})
app.on('activate',()=>{
    if(BrowserWindow.getAllWindows().length===0){
        createWindow();
    }
})