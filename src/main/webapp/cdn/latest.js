var projectTypes = {
    "PROPC": {
        "editor": "blocklyc.jsp",
        "class": "editor-c-link"
    },
    "SPIN": {
        "editor": "blocklyspin.jsp",
        "class": "editor-spin-link"
    }
};

$.get("rest/shared/project/list?sort=modified&order=desc&limit=5&offset=0", function (data) {
    $.each(data['rows'], function (index, project) {
        var user = '';
        if (project['user']) {
            user = ' (' + project['user'] + ')';
        }
        var projectItem = $("<li/>", {
            "class": "project"
        });
        $("<a/>", {
            "class": "editor-view-link editor-icon " + projectTypes[project['type']]['class'],
            "href": "editor/" + projectTypes[project['type']]['editor'] + "?project=" + project['id'],
            "text": project['name'] + user
        }).appendTo(projectItem);
        $(".latest-projects").append(projectItem);
    });
});

