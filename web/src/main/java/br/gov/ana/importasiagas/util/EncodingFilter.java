package br.gov.ana.importasiagas.util;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

public class EncodingFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
            FilterChain chain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
            req.setCharacterEncoding("UTF-8");
        chain.doFilter(req, response);
    }

    @Override
    public void init(FilterConfig arg) throws ServletException {
    }

    @Override
    public void destroy() {
    }
}
