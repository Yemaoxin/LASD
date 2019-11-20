package com.lasd.leopard.Utils;

public class RequestData {
    private String t;
    private String roomId;
    private String t2;
    private String buildingId;
    private  String batch;
    private  String page;
    public String getBatch() {
        return batch;
    }

    public String getBuildingId() {
        return buildingId;
    }

    public String getRoomId() {
        return roomId;
    }

    public String getPage() {
        return page;
    }

    public String getT() {
        return t;
    }

    public String getT2() {
        return t2;
    }


    public void setBatch(String batch) {
        this.batch = batch;
    }

    public void setBuildingId(String bulidingId) {
        this.buildingId = bulidingId;
    }

    public void setPage(String page) {
        this.page = page;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public void setT(String t) {
        this.t = t;
    }

    public void setT2(String t2) {
        this.t2 = t2;
    }
}
