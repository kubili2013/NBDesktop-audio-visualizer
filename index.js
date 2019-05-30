let audio_plugin = getPluginByName("音频可视化");
let audio_area = document.createElement('webview');
audio_area.setAttribute("src",audio_plugin.path + "index.html");
audio_area.setAttribute("style","position:absolute;top:0px;left:0px;")
document.body.append(audio_area);

audio_area.addEventListener('dom-ready', e => {
    audio_area.executeJavaScript("Player.tracks  = " + JSON.stringify(audio_plugin.setting.music, null) + ";Player.init();");
});
