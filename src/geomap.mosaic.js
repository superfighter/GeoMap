GeoMap.isPointInsidePath = function(pts, pt) {
  var i,
    j,
    k,
    n = pts.length,
    wn = 0;

  for(i = n-1, j = 0; j < n; i = j, j++) {
    k = (pt[0] - pts[i][1]) * (pts[j][2] - pts[i][2]) - (pts[j][1] - pts[i][1]) * (pt[1] - pts[i][2]);
    if((pt[1] >= pts[i][2] && pt[1] <= pts[j][2])||(pt[1] <= pts[i][2] && pt[1] >= pts[j][2])) {
      if( k < 0){
        wn++;
      }else if(k > 0){
        wn--;
      }else{
        if( (pt[1] <= pts[i][2] && pt[1] >= pts[j][2] && pt[0] <= pts[i][1] && pt[0] >= pts[j][1]) ||
          (pt[1] <= pts[i][2] && pt[1] >= pts[j][2] && pt[0] >= pts[i][1] && pt[0] <= pts[j][1]) ||
          (pt[1] >= pts[i][2] && pt[1] <= pts[j][2] && pt[0] <= pts[i][1] && pt[0] >= pts[j][1]) ||
          (pt[1] >= pts[i][2] && pt[1] <= pts[j][2] && pt[0] >= pts[i][1] && pt[0] <= pts[j][1]) ){
          return 0; //点在多边形边界上
        }
      }

    }
  }
  if(wn == 0){
    return 1; //点在多边形外部
  }else{
    return -1; //点在多边形内部
  }
};

/*

 TODO: 部分path是由多个m-z组成的，所以判断每个path时，需要从d属性获取string，截取成数组，然后使用isPointInside

 TODO: 点的间隔需要严格固定！！！

*/

GeoMap.prototype.mosaic = function(cfg) {
	var deCfg = {
		fill: '#333',
		'stroke-width': 0,
		opacity: 0.8,
		sideSize: 10
	};

	var self = this,
	shapes = self.shapes,
	paths = self.paths,
	canvas = self.canvas,
	config = self.config,
	style = config.mapStyle,
	offset = config.offset,
	scale = config.scale,
	background = config.background,
	crossline = config.crossline,
	width = self.width,
	height = self.height,
	left = self.left + 5,
	top = self.top + 7,
	mapleft = convertor.xmin,
	maptop = convertor.ymin,
	mapwidth = convertor.xmax - convertor.xmin,
	mapheight = convertor.ymax - convertor.ymin,
	aPath = null,
	linehead, linex, liney, back, i, len, currentPath;

	if (!scale) {
		var temx = width / mapwidth,
		temy = height / mapheight;
		temx > temy ? temx = temy: temy = temx;
		temx = temy * 0.73;
		self.config.scale = scale = {
			x: temx,
			y: temy
		};
	}

	if (!offset) {
		self.config.offset = offset = {
			x: mapleft,
			y: maptop
		};
	}

	back = canvas.rect(mapleft, maptop, mapwidth, mapheight).scale(scale.x, scale.y, 0, 0).attr({
		'fill': background,
		'stroke-width': 0
	});

	for (i = 0, len = paths.length; i < len; i++) {
		currentPath = paths[i];
		if (currentPath.type == 'point' || currentPath.type == 'MultiPoint') {
			//TODO
		} else {
			aPath = canvas.path(currentPath.path).data({
        'ps': currentPath.path,
				'properties': currentPath.properties,
				'id': currentPath.id
			}).attr({
        'fill': background,
        'stroke-width': 0
      });
		}
		shapes.push(aPath);
	}

  var arrPos = [];
  var sideSize = 2;
  var halfSide = sideSize / 2;

  /**/
  shapes.forEach(function(v, idx){
  
    //if(idx > 30 || idx < 30) return;
//    if(idx > 30) return false;

    var bbox = v.getBBox();
    var startX = ~~( (bbox.x - halfSide) / sideSize ) * sideSize;
    var startY = ~~( (bbox.y- halfSide) / sideSize ) * sideSize;
    var i, j, oKey;
    var temX, temY;

    //console.log(bbox);

    for(i = 0; i * sideSize < bbox.width; i++){
      
      temX = i * sideSize + startX;

      for(j = 0; j * sideSize < bbox.height; j++){

        temY = j * sideSize + startY;

        //console.log(temX + ' , ' + temY);
        console.log(1);
        
//        canvas.circle(temX, temY, i);
        

        if(GeoMap.isPointInsidePath(v.attrs.path, [temX, temY]) != 1){
        //if(v.isPointInside(temX, temY)){

          arrPos.push([temX, temY]);

        }

      }

    }
  
  });
  /**/


  arrPos.forEach(function(v){
  
    canvas.circle(v[0], v[1],0.5).attr({
      'stroke-width': 0,
      'fill': '#333'
    }).scale(2.5,2.5,0,0);
  
  });


  /*

	if (Raphael.svg) {
		canvas.setViewBox(offset.x, offset.y, width, height, false);
		shapes.attr(style).scale(scale.x, scale.y, mapleft, maptop);
	} else {
		shapes.attr(style).translate(offset.x - 450, offset.y - 50).scale(scale.x, scale.y, mapleft, maptop);
	}

  */

};
