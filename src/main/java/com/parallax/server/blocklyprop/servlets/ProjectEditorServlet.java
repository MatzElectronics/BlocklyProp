/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.parallax.server.blocklyprop.servlets;

import com.google.inject.Inject;
import com.google.inject.Singleton;
import com.parallax.server.blocklyprop.converter.ProjectConverter;
import com.parallax.server.blocklyprop.db.enums.ProjectType;
import com.parallax.server.blocklyprop.db.generated.tables.records.ProjectRecord;
import com.parallax.server.blocklyprop.services.ProjectService;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 *
 * @author Michel
 */
@Singleton
public class ProjectEditorServlet extends HttpServlet {

    private ProjectService projectService;
    private ProjectConverter projectConverter;

    /**
     * Application logging facility
     */
    private static final Logger LOG = LoggerFactory.getLogger(ProjectEditorServlet.class);


    @Inject
    public void setProjectService(ProjectService projectService) {
        this.projectService = projectService;
    }

    @Inject
    public void setProjectConverter(ProjectConverter projectConverter) {
        this.projectConverter = projectConverter;
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        
        String idProjectString = req.getParameter("id");
        Long idProject = null;

        LOG.info("REST:/projecteditor/{} Get request received", idProjectString); 

        try {
            idProject = Long.parseLong(idProjectString);
        } catch (NumberFormatException nfe) {
            // Show error screen
            req.getRequestDispatcher("/WEB-INF/servlet/project/not-found.jsp").forward(req, resp);
        }
        
        LOG.info("Getting project {}", idProject);
        ProjectRecord project = projectService.getProject(idProject);
        if (project == null) {
            // Project not found, or invalid share key
            LOG.info("Project {} was not found.",idProjectString);
            req.getRequestDispatcher("/WEB-INF/servlet/project/not-found.jsp").forward(req, resp);
        } else {
            LOG.info("returning project {} to /editor/blocklyc.jsp", project.getId());
                resp.sendRedirect(req.getContextPath() + "/editor/blocklyc.jsp?project=" + project.getId());
        }
    }

}
