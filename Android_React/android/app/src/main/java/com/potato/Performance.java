package com.potato;

import java.io.Serializable;

public class Performance implements Serializable {
    private int countHead;
    private int countDrowsy;
    private String authorized ;
    private String evidenceDrowsy;
    private String evidenceHead;

    public Performance(int countHead, int countDrowsy, String authorized, String evidenceDrowsy, String evidenceHead) {
        this.countHead = countHead;
        this.countDrowsy= countDrowsy;
        this.authorized = authorized;
        this.evidenceDrowsy = evidenceDrowsy;
        this.evidenceHead = evidenceHead;
    }
    public Performance() {
        this.countHead=0;
        this.countDrowsy =0;
        this.authorized = "";
        this.evidenceDrowsy ="";
        this.evidenceHead = "";
    }

    public String getAuthorized() {
        return authorized;
    }

    public void setAuthorized(String authorized) {
        this.authorized = authorized;
    }

    public int getCountDrowsy() {
        return countDrowsy;
    }

    public void setCountHead(int countHead) {
        this.countHead = countHead;
    }

    public void setCountDrowsy(int countDrowsy) {
        this.countDrowsy = countDrowsy;
    }

    public int getCountHead() {
        return countHead;
    }

    public String getEvidenceDrowsy() {
        return evidenceDrowsy;
    }

    public void setEvidenceDrowsy(String evidence) {
        this.evidenceDrowsy = evidence;
    }

    public String getEvidenceHead() {
        return evidenceHead;
    }

    public void setEvidenceHead(String evidenceHead) {
        this.evidenceHead = evidenceHead;
    }
}
