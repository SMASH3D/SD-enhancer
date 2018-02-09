$('#tabs-links > table > tbody > tr:nth-child(6) > td:nth-child(2) > a').on('mousedown', function(e){
    console.log('mousedown on vote');
    var nextVoteDate = new Date();
    nextVoteDate.setHours(nextVoteDate.getHours()+2);
    var datetime = nextVoteDate.toLocaleString();
    $(this).parent().append('<p>Next vote: '+datetime+'</p>');
});

//save nextvoteDate in local storage
//if time > nexvoteDate => print "Vote now ! in green"
