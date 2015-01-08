// Export MovieClip for TexturePacker extension
// - Exports vaild .swf format from movieclip for TexturePacker or other 3rd party spritesheet packer softwares.

// erinylin.com (c) 2014, 
// https://github.com/erinlin/jsfl-tools/
//
// To Use copy the script to the appropriate location:
//  Windows Vista and Windows 7: 
//      boot drive\Users\username\Local Settings\Application Data\Adobe\Flash CS5\language\Configuration\Commands
//  Windows XP: 
//      boot drive\Documents and Settings\username\Local Settings\Application Data\Adobe\Flash CS5\language\Configuration\Commands 
//  Mac OS X:
//      Macintosh HD/Users/username/Library/Application Support/Adobe/Flash CS5/language/Configuration/Commands
//
//  To run, in Flash, select Commands -> Export MovieClip for TexturePacker
//     -> you will get a vaild .swf for spritesheet packer sofeware.
//

var path = fl.scriptURI.substr( 0 , fl.scriptURI.lastIndexOf("/") + 1 );

var doc = fl.getDocumentDOM();

var message = "";

function clearOut() {
    fl.outputPanel.clear();
}

function print(str) {
    message += str + "\n";
}

function outputSWF(elements, folderURI, forceOutput ){
    for (var edx = 0; edx < elements.length; ++edx) {
        var element = elements[edx];

        if(!element) continue;
        var elementType = element.elementType;
        var instanceType = element.instanceType;
        var symbolType = element.symbolType;

        var outputName = element.name;
        if(symbolType=="movie clip"){
            var libItem = element.libraryItem;
            outputName = libItem.name;

            var totalframes = libItem.timeline.frameCount;

            // paste MovieClip to new document.
            var exportdoc = fl.createDocument();
            exportdoc.frameRate = doc.frameRate;
            exportdoc.addItem({x:0, y:0}, libItem);

            var tl = exportdoc.getTimeline();
            var mc = tl.layers[0].frames[0].elements[0];
            
            //added new keyframe in frame 1
            tl.setSelectedLayers(0);
            tl.insertFrames(totalframes-1);

            //check the largest size for movieclip
            mc.symbolType = "graphic";
            exportdoc.selectAll();
            exportdoc.group();
            var w = mc.width;
            var h = mc.height;
            exportdoc.width = Math.ceil(w);
            exportdoc.height = Math.ceil(h);
            exportdoc.align('top', true);
            exportdoc.align('left', true);
            exportdoc.exportSWF(folderURI+'/'+outputName+".swf", true);
            print(folderURI+'/'+outputName+".swf, saved.");
            //deleted the output document.
            exportdoc.selectNone();
            exportdoc.close(false);
        }
    }
}


function retrieveMovieClip(folderURI) {

    clearOut();

    var tl = doc.getTimeline();
    var library = doc.library;

    var layerCount = tl.layerCount;

    var elements = doc.selection;

    //output selected movieclips.
    if(elements.length > 0 ){
        outputSWF(elements, folderURI, true);
        doc.selectNone();
    }else{
        // output all movieclips are in frame 1 of main timeline
        for (ldx = 0; ldx < layerCount; ++ldx) {
            var layer = tl.layers[ldx];
            var frame = layer.frames[0];
            var layerType = layer.layerType;

            if (layerType =="mask" || layerType=="folder" || layerType=="guide" || frame.elements.length<1) {
                continue;
            }
            outputSWF(frame.elements, folderURI );
        }
    }

    return true;
}

function runScript() {

    clearOut();
    var folderURI = fl.browseForFolderURL("Select output a folder.");

    if(!folderURI){
        clearOut();
        fl.trace("command canceled.");
        return;
    }

    retrieveMovieClip(folderURI);
    doc.exitEditMode();
    fl.trace(message);
}

runScript();
