Random = function(seed)
{
	this.xors = {
        x: (seed) | 0,
        y: (2) | 0,
        z: (3) | 0,
        w: (5) | 0
    };
	
	this.nextInt = function()
	{
		var t = this.xors.x ^ (this.xors.x << 11);
        this.xors.x = this.xors.y;
        this.xors.y = this.xors.z;
        this.xors.z = this.xors.w;
        return this.xors.w = (this.xors.w^(this.xors.w>>>19))^(t^(t>>>8));
	};
	
	this.nextIndex = function(max)
	{
		return Math.abs(this.nextInt()) % max;
	}
	
	for (var i = 0; i < 4; ++i)
	{
		this.nextInt();
	}
	
	this.nextDouble = function()
	{
		return this.nextInt() / 2147483648;
	}
};

RandomBag = function(arr, random)
{
	if (arr == null || arr.length < 2) return;
	this.arr = arr;
	this.random = random;
	this.availableIndices = [];
	this.lastElementIndex = null;
	
	this.next = function()
	{
		if (this.availableIndices.length == 0)
		{
			// need to rebuild
			for (var i = 0; i < this.arr.length; ++i)
			{
				this.availableIndices.push(i);
			}
		}
		
		var indexIndex = -1;
		var randomIndex = -1;
		do
		{
			indexIndex = random.nextIndex(this.availableIndices.length);
			randomIndex = this.availableIndices[indexIndex];
		}
		while (randomIndex == this.lastElementIndex);
		
		var tmp = this.arr[randomIndex];
		this.availableIndices.splice(indexIndex, 1);
		this.lastElementIndex = randomIndex;
		return tmp;
	}
};

window.onload = function()
{
	// Initial seed values for top tilt, top colors and middle.
	// These are used to create new Random objects later.
	// Also need to be displayed later and can be overwritten.
	var seedTopTilt = (2147483648 * Math.random()) | 0;
	var seedTopColors = (2147483648 * Math.random()) | 0;
	var seedMiddle = (2147483648 * Math.random()) | 0;
	
	var maximum_tilt = 0.2;
/*
    var seed = {
        x: (2147483648 * Math.random()) | 0,
        y: (2147483648 * Math.random()) | 0,
        z: (2147483648 * Math.random()) | 0,
        w: (2147483648 * Math.random()) | 0
    };
    function randomInt(xors) {
        var t = xors.x ^ (xors.x << 11);
        xors.x = xors.y;
        xors.y = xors.z;
        xors.z = xors.w;
        return xors.w = (xors.w^(xors.w>>>19))^(t^(t>>>8));
    }
    function random(xors) {
        return randomInt(xors) / 2147483648;
    }
    function shuffle(xs){
        var v = Object.assign({}, seed);
        var xs = xs.slice();
        var ys = [];
        while(0 < xs.length){
            var i = Math.abs(randomInt(v)) % xs.length;
            ys.push(xs[i]);
            xs.splice(i, 1);
        }
        return ys;
    }
	
	function get_random_element(arr, xors)
	{
		var index = Math.abs(randomInt(xors)) % arr.length;
		var tmp = arr[index];
		
		//alert("" + arr + " -- " + index + "//" + tmp);
		
		return tmp;
	}
	*/

    var colorTuples = [
        ["#16ae67", "#90c31f"], 
        ["#ea5421", "#f39800"], 
        ["#00ac8e", "#e4007f"], 
        ["#227fc4", "#00a1e9"], 
        ["#9fa0a0", "#c9caca"], 
        ["#e60013", "#f39800"], 
        ["#c3d600", "#a42e8c"]
    ];

    var topColors = ["#04ad8f", "#a6ce48", "#f3a118", "#ea6435", "#17b297", "#e30983", "#2782c4", "#1aa6e7", "#b5b5b5", "#f29905", "#e50011", "#ccdc26", "#a5328d", "#0aaa60", "#91c423", "#f29300", "#ec5f69", "#22b69e", "#e63e9b", "#917220"];


    var topInput = document.querySelector("#top");
    var middleInput = document.querySelector("#middle");
    var bottomInput = document.querySelector("#bottom"); 

    var top = document.querySelector(".top");
    var middle = document.querySelector(".middle");
    var bottom = document.querySelector(".bottom");

    var foreground = document.getElementById("foreground");
    var image = document.getElementById("result");
    
    var container = document.querySelector(".container");
    var download = document.getElementById("download");

    var canvas = document.createElement("canvas");
    var g = canvas.getContext("2d");
	
	var randomizeTopTiltButton = document.getElementById("randomize_top_tilt");
	var randomizeTopColorsButton = document.getElementById("randomize_top_colors");
	var randomizeMiddleButton = document.getElementById("randomize_middle");

	var topTiltLabel = document.getElementById("top_tilt_seed");
	var topColorLabel = document.getElementById("top_color_seed");
	var middleLabel = document.getElementById("middle_seed");


    function update(){
		// enforce closure
		var topValue = topInput.value;
		var middleValue = middleInput.value;
		var bottomValue = bottomInput.value;
        //setTimeout(function()
		//{
		//	console.log(topInput.value);
            setText(topValue, middleValue, bottomValue);
        //});
    }
	
    topInput.addEventListener("input", update);    
    middleInput.addEventListener("input", update);
    bottomInput.addEventListener("input", update);        

    function setText(topText, middleText, bottomText)
	{
		topTiltLabel.innerHTML = seedTopTilt;
		topColorLabel.innerHTML = seedTopColors;
		middleLabel.innerHTML = seedMiddle;
		
		var topTextSize = 30;
        var topMiddlePadding = 30;
        var middleTextSize = 120;
        var middleBottomPadding = 20;        
        var bottomTextSize = 30;
        var margin = 60;
        var bottomTextLetterSpacing = 20;

        //var topTextFont = `normal bold ${topTextSize}px/2 "Yu Mincho"`;
		var topTextFont = `normal bold ${topTextSize}px/2 "Yu Mincho", "Trebuchet MS", sans-serif`;
        var middleTextFont = `normal 400 ${middleTextSize}px/2 japarifont`;
        var bottomTextFont = `normal 400 ${bottomTextSize}px/2 PlayBold`;

        // resize canvas
        g.font = topTextFont;
        var topMetrics = g.measureText(topText);
        g.font = middleTextFont;
        var middleMetrics = g.measureText(middleText);  
        g.font = bottomTextFont;
        var bottomMetrics = g.measureText(bottomText);  
        canvas.width = margin + Math.max(
            topMetrics.width, 
            middleMetrics.width, 
            bottomMetrics.width + bottomTextLetterSpacing * (bottomText.length - 1)
        ) + margin;
        canvas.height = margin + topTextSize + topMiddlePadding + middleTextSize + middleBottomPadding + bottomTextSize + margin;

        // prepare canvas
        g.save();
        g.clearRect(0, 0, canvas.width, canvas.height);
        g.textBaseline = "top";



        // stroke top text 
        function iterate(callback){
            var randomTilt = new Random(seedTopTilt);
            g.save();

            g.font = topTextFont;        
            g.fillStyle = "white";
            g.strokeStyle = "white";
            g.lineJoin = "round";    
            g.lineWidth = 10.0;   
            var metrics = g.measureText(topText);
            g.translate(margin + (canvas.width - metrics.width - margin * 2) * 0.5, margin);
            var x = 0;
            for(var i = 0; i < topText.length; i++){
                var c = topText.slice(i, i + 1);
                var rot = randomTilt.nextDouble() * maximum_tilt;
                var metrics = g.measureText(c);
                g.save();
                g.translate(metrics.width * 0.5, topTextSize * 0.5);
                g.rotate(rot);
                g.translate(-metrics.width * 0.5, -topTextSize * 0.5);
                callback(i, c);
                g.restore();
                g.translate(metrics.width, 0);
            }
            g.restore();
        }
        g.save();
        


        var topColors = ["#04ad8f", "#a6ce48", "#f3a118", "#ea6435", "#17b297", "#e30983", "#2782c4", "#1aa6e7", "#b5b5b5", "#f29905", "#e50011", "#ccdc26", "#a5328d", "#0aaa60", "#91c423", "#f29300", "#ec5f69", "#22b69e", "#e63e9b", "#917220"];

		var randomTopColors = new Random(seedTopColors);
		var topColorsBag = new RandomBag(topColors, randomTopColors);
        iterate(function(i, c){
            g.shadowColor = "transparent";

            g.strokeText(c, 0, 0);            
        });
        iterate(function(i, c){
            g.shadowColor = "rgba(0, 0, 0, 0.3)";
            g.shadowBlur = 10;
            //g.fillStyle = topColors[i % topColors.length];
			g.fillStyle = topColorsBag.next();
            g.fillText(c, 0, 0);
        });


		
		//
		// middle text
		//



        // centerize
        var metrics = g.measureText(middleText);
        g.translate((canvas.width - middleMetrics.width) * 0.5, margin + topTextSize + topMiddlePadding);

        // stroke outline
        g.font = middleTextFont;
        g.strokeStyle = "white";
        g.lineWidth = 20.0;
        g.shadowColor = "rgba(0, 0, 0, 0.3)";
        g.shadowBlur = 10;
        g.lineCap = "round";
        g.lineJoin = "round";
        g.strokeText(middleText, 0, 0);
        
        // fill charactors
        
		var randomMiddle = new Random(seedMiddle);
		var middleColorsBag = new RandomBag(colorTuples, randomMiddle);
        for(var i = 0; i < middleText.length; i++){
            var c = middleText.slice(i, i + 1);

			var the_tuple = middleColorsBag.next();
			
            // base color
            g.shadowColor = "rgba(0, 0, 0, 0.6)";
            g.shadowBlur = 10;
            //g.fillStyle = colorTuples[i % colorTuples.length][0];
            g.fillStyle = the_tuple[0];
            g.fillText(c, 0, 0);

            g.save();

            // clip
            var rot = randomMiddle.nextDouble();
            g.beginPath();
            g.save();
            g.translate(middleTextSize * 0.5, middleTextSize * 0.5);            
            g.rotate(rot);
            g.translate(-middleTextSize * 0.5, -middleTextSize * 0.5);
            g.moveTo(-middleTextSize * 2, middleTextSize * 0.5);
            g.lineTo(middleTextSize * 2, middleTextSize * 0.5);
            g.lineTo(middleTextSize * 2, middleTextSize * 2);
            g.lineTo(-middleTextSize * 2, middleTextSize * 2);
            g.closePath();
            g.restore();
            g.clip();

            // upper color
            g.shadowColor = "none";
            g.shadowBlur = 0;
            //g.fillStyle = colorTuples[i % colorTuples.length][1];
			g.fillStyle = the_tuple[1];
            g.fillText(c, 0, 0);

            g.restore();

            // go to next
            var metrics  = g.measureText(c);
            g.translate(metrics.width, 0);
        }
        
        g.restore();

        // bottom text
        g.save();
        g.strokeStyle = "white";
        g.fillStyle = "#977a2d";
        g.lineWidth = 13.0;
        g.lineCap = "round";
        g.lineJoin = "round";
        g.textBaseline = "top";
        g.font = bottomTextFont;      

        var metrics = g.measureText(bottomText);
        g.translate(
            (canvas.width - metrics.width - (bottomText.length - 1) * bottomTextLetterSpacing) * 0.5, 
            margin + topTextSize + topMiddlePadding + middleTextSize + middleBottomPadding
        );

        for(var i = 0; i < bottomText.length; i++){
            var c = bottomText.slice(i, i + 1);
            g.shadowColor = "rgba(0, 0, 0, 0.3)";
            g.shadowBlur = 10;
            g.strokeText(c, 0, 0);
            g.shadowColor = "transparent";
            g.fillText(c, 0, 0);
            var metrics = g.measureText(c);
            g.translate(metrics.width + bottomTextLetterSpacing, 0);
        }

        g.restore();


        var url = canvas.toDataURL();
        image.src = url;
        download.href = url;

    }

    topInput.value = "女の子の姿になった動物たちが繰り広げる大冒険！";
    middleInput.value = "けものフレンズ";
    bottomInput.value = "KEMONO FRIENDS";
    update();
	
	randomizeTopTiltButton.addEventListener("click", function()
	{
		seedTopTilt = (2147483648 * Math.random()) | 0;
		update();
	});
	randomizeTopColorsButton.addEventListener("click", function()
	{
		seedTopColors = (2147483648 * Math.random()) | 0;
		update();
	});
	randomizeMiddleButton.addEventListener("click", function()
	{
		seedMiddle = (2147483648 * Math.random()) | 0;
		update();
	});
		
    download.addEventListener("click", function(){
        canvas.toBlob(function(blob) {
            saveAs(blob, middleInput.value + ".png");
        });
    });
};

