/**
 * Created by rolf on 12-2-15.
 */
var mongoose = require('mongoose')
,  Word = mongoose.model('Word')
, liner = require('./liner')
, fs = require('fs')
;
function onInsert(err, docs){
    if (err){
        console.log("Error inserting words");
    } else {
        console.log('inserted %d words in database', docs.length);
        Word.syncRandom(function(err, result){
            console.log("words updated");
        });
    }
    
}
Word.count(function(err, c){
    console.log('initializing database');
    if(c === 0){
        var source = fs.createReadStream(__dirname+'/../data/words.txt');
        source.pipe(liner);
        var bulk = [];
        liner.on('readable', function(){
            var line;
            while (line = liner.read()){
                bulk.push({content: line});
            }
        });
        liner.on('end', function(){
            Word.collection.insert(bulk, onInsert);
        });
    }
    
});

