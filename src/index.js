import './index.css';

window.onload = function() {

    var audio = document.getElementById("audio"),
        playBtn = document.getElementById("play"),
        pauseBtn = document.getElementById("pause"),
        volumnEle = document.getElementById("volumn");
    var audioContext, buffer, bufferSource, gainNode;
    var bufferArr, duration, speed, times;

    // 创建audioContext上下文
    function createAudioContext() {
        window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
        audioContext = new AudioContext();
    }
    // buffer解析函数
    function decodeAudioData(file, fn) {
        var fr = new FileReader();
        fr.onload = function (e) {
            var fileResult = e.target.result;
            audioContext.decodeAudioData(fileResult, function (buffer) {
                if(buffer) {
                    fn(buffer)
                }else {
                    alert("文件解码失败")
                    return;
                }
            }, function (e) {
                console.log(e)
                alert("文件解码失败")
            })
        }
        fr.readAsArrayBuffer(file);
    }

    // 创建GainNode节点
    function createGainNode() {
        gainNode = audioContext.createGain();
    }

    // 创建audioNode
    function createAudioNode(buffer) {
        // 输入源节点
        bufferSource = audioContext.createBufferSource()

        // 创建了 AudioBufferSourceNode 对象后，
        // 把 buffer 格式的音频数据赋值给 AudioBufferSourceNode 对象的 buffer 属性，
        // 此时音频已经传递到音频源，可以对音频进行处理或输出。
        bufferSource.buffer = buffer;

        // 创建输出节点
        let audioDestinationNode = audioContext.destination;
        // 创建音频节点
        createGainNode();

        // 连接音量模块
        bufferSource.connect(gainNode);
        // 连接输出模块
        // bufferSource.connect(audioDestinationNode);

        gainNode.connect(audioDestinationNode);

        bufferSource.onended = () => {
            clearInterval(times)
        }
    }

    // draw canvas 方法
    function drawAudio() {
        var canvas = document.getElementById('canvas');
        var line_width = .5;
        var rate = 44;
        canvas.width = bufferArr.length/(rate/line_width);
        var ctx = canvas.getContext('2d');

        ctx.beginPath();
        ctx.moveTo(0, 200);//起始位置
        ctx.lineTo(10000, 200);//停止位置
        for (var i = 0; i < bufferArr.length; i++) {
            ctx.moveTo(i*line_width, 200);//起始位置
            ctx.lineTo(i*line_width, 200-bufferArr[i*rate]*100);//停止位置
        }
        ctx.lineWidth=line_width;
        ctx.strokeStyle="rgb(102, 243, 163)";
        ctx.stroke();

        speed = (duration*1000)/canvas.width;
        console.log(duration,canvas.width,speed)

    }

    function animateRun() {
        var left = 0;
        var fps = 2; // 帧率
        console.log(speed)
        times = setInterval(function(){
            left -= fps;
            canvas.style.left = left + 'px'
        },speed*fps)
    }
    
    // 文件上传
    audio.onchange = function () {
        if (audio.files.length !== 0) {
            decodeAudioData(audio.files[0], (buf)=> {
                console.log('buffer===>',buf)
                console.log(buf.getChannelData(0))
                buffer = buf;
                bufferArr = new Float32Array(buffer.getChannelData(0));
                duration = buffer.duration
                drawAudio();
                // 注意调用该方法后，无法再次调用 AudioBufferSourceNode.start 播放
                createAudioNode(buffer)
            });
        }
    }
    // 点击播放
    playBtn.addEventListener('click', (event)=> {
        // 注意调用该方法后，无法再次调用 AudioBufferSourceNode.start播放。所以在每次播放的时候 都需要重新构建audioNode
        createAudioNode(buffer);
        bufferSource.start();
        animateRun();
    })
    // 点击暂停
    pauseBtn.addEventListener('click', (event)=> {
        bufferSource.stop();
    })

    //改变音量
    volumnEle.addEventListener('change', (event) => {
        gainNode && (gainNode.gain.value = event.target.value / 50);
    });

    function init() {
        createAudioContext();
    }
    init();

    var arr = []
    var floatArr = new Float32Array(5999999)

    function initArr() {    
        floatArr.map((item)=> {
            arr.push(item)
        })
        console.log('init arr done')
        
    }
    var testEle = document.querySelector('#testBtn')
    testEle.onclick = function() {
        initArr()
        testArr()
    }
    
    function testArr() {
        var floatArr2 = floatArr.map(item=> item+=10)
        var floatArr3 = arr.map(item=>item+=10)
        console.log('float32array===>',floatArr2)
        console.log('array==>',floatArr3)
    }

}
