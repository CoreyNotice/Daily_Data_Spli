const {app, BrowserWindow,Menu,Tray}= require('electron')
 const path= require('path');
 

let tray=null
const dockIcon = path.join(__dirname,'frontend','daily_data_split', 'public', 'tray_icon.png');
const LargeIcon = path.join(__dirname,'frontend','daily_data_split', 'public', 'desktop_icon.png');

function createSplashWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 200,
    icon:LargeIcon,
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: false,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
    }
  })

  win.loadFile('splash.html')
  return win;
}

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

 app.whenReady()
 .then(() => {
    tray = new Tray(dockIcon);
  tray.setToolTip('Daily Data Split');
    const template = require('./utils/menu').createTemplate(app)
  const menu=Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)



const mainApp = createWindow();
const splash = createSplashWindow();

mainApp.once('ready-to-show', () => {
   setTimeout(() => {
splash.destroy();
mainApp.show()
}, 5000);
});

})

app.on('window-all-closed',()=>{
    app.quit()
})
app.on('activate',()=>{
    if(BrowserWindow.getAllWindows().length===0){
        createWindow();
    }
})