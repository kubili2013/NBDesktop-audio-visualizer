let audio_v_plugin = Plugin.getPluginByName("音频可视化");
let audio_v_config = JSON.parse(fs.readFileSync(audio_v_plugin.path + "plugin.json"))

let audio_v_template_tab = `
<div class="tab">
<h2>音乐可视化配置</h2>
<div class="list" style="text-align: right;">
    <button id="audio-v-start-btn" onclick="Plugin.startDesktopWidgetPlugin('音频可视化')">开启可视化音频播放器</button>
    <button id="audio-v-start-btn" onclick="Plugin.endDesktopWidgetPlugin('音频可视化')">关闭可视化音频播放器</button>
    <button id="audio-v-setting-btn" onclick="settingMusicFoder()">选取音乐</button>
</div>
<div class="list" id="audio_v_music_list">
    {list}
</div>
</div>
<script>Controller.reInit()</script>
`;

let audio_v_template = `
<div class="item" style="height:60px; line-height:60px;"  id="audio_v-item-{index}">
    <div class="info" style="height:60px; line-height:60px;">
        <div style="padding-top:0px;"><p class="item-title">{name}</p></div>
    </div>
    <div class="date">
    </div>
    <div class="handler" style="width:350px;line-height:60px;">
        <button style="padding:5px 10px;" id="zhibo-item-{index}-end-btn" onclick="removeMusic({index})">移除</button>
    </div>
</div>
`;

function loadAudioV() {
    $(".menu").append('<li><a href="javascript:void(0)"><img src="' + audio_v_plugin.path + '/' + audio_v_plugin.image + '"><span>音乐可视化</span></a></li>');
    let html = ""
    for(let i=0;i<audio_v_config.setting.music.length;i++){
        html += audio_v_template.replace(/\{index\}/g, i)
        .replace(/\{name\}/g, audio_v_config.setting.music[i].song)
    }
    $(".content").append(audio_v_template_tab.replace("{list}",html));
}

function settingMusicFoder() {
    remote.dialog.showOpenDialog(
        {
            properties: ['multiSelections'],
            filters: [
                { name: '音乐', extensions: ['mp3', 'wav'] }
              ]
        },
        function (files) {
            if (files) {
                loadMusic(files);
            }
        }
    )
}

function removeMusic(index){
    audio_v_config.setting.music.splice(index,1);
    fs.writeFileSync(audio_v_plugin.path + "plugin.json", JSON.stringify(audio_v_config, null, 4));
    ipcRenderer.send("reload-plugins");
    refreshMusicList();
}

function loadMusic(files) {
    for(let i=0;i<files.length;i++){
        let basename = path.basename(files[i]);
        let music = {
            artist: "",
            song: basename,
            url: "file:///" + files[i].replace(/\\/g,"/")
        }
        audio_v_config.setting.music.push(music);
    }
    fs.writeFileSync(audio_v_plugin.path + "plugin.json", JSON.stringify(audio_v_config, null, 4));
    // refresh
    ipcRenderer.send("reload-plugins");
    refreshMusicList();
}

function refreshMusicList(){
    let html = ""
    for(let i=0;i<audio_v_config.setting.music.length;i++){
        html += audio_v_template.replace(/\{index\}/g, i)
        .replace(/\{name\}/g, audio_v_config.setting.music[i].song)
    }
    $("#audio_v_music_list").html(html);
}

$(function () {
    loadAudioV();
});