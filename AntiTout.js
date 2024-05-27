// Add this script to your common.js page on Wikivoyage

// Function to revert the latest edit
function revertToutEdit(pageTitle) {
    var api = new mw.Api();
    
    // Get the latest revision ID
    api.get({
        action: 'query',
        titles: pageTitle,
        prop: 'revisions',
        rvprop: 'ids',
        rvlimit: 1,
        formatversion: 2
    }).done(function(data) {
        console.log('Received data for latest revision:', data);
        
        // Ensure the data structure is as expected
        var pages = data.query.pages;
        if (pages) {
            var pageId = Object.keys(pages)[0];  // Get the first page ID
            var page = pages[pageId];
            
            if (page.revisions && page.revisions.length > 0) {
                var revisionId = page.revisions[0].revid;
                console.log('Latest revision ID:', revisionId);
                
                // Undo the latest revision
                api.postWithToken('csrf', {
                    action: 'edit',
                    title: pageTitle,
                    undo: revisionId,
                    summary: 'Reverting [[WV:TOUT|touting]]'
                }).done(function() {
                    alert('Edit reverted successfully');
                }).fail(function(error) {
                    alert('Error reverting edit: ' + error);
                    console.error('Error details:', error);
                });
            } else {
                alert('No revisions found for the page.');
            }
        } else {
            alert('Could not find the page.');
        }
    }).fail(function(error) {
        alert('Error fetching latest revision ID: ' + error);
        console.error('Error details:', error);
    });
}

// Function to post {{subst:tout}} on the user's talk page
function warnUser(userName) {
    var api = new mw.Api();
    var userTalkPage = 'User talk:' + userName;
    var warningTemplate = '\n{{subst:tout}} ~~~~';

    api

