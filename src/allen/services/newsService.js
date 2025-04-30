import myAxios from "@/plugins/axios";

//取得全部已發布新聞(支援分頁)
export const fetchPublishedNews = (page = 0, size = 10) => {
    return myAxios.post(`/news/public`,{},{
        params:{
            page,
            size,
            sort: 'publishAt,desc', 
        },
    });
};

//取得單一已發布新聞(+1 viewCount)
export const fetchPublishedNewsById = (id) => {
    return myAxios.get(`/news/public/${id}`);
}

//彈性搜尋新聞(關鍵字 + 類別)
export const searchPublishedNews = (searchRequest, page = 0, size = 10) => {
    return myAxios.post(`/news/public/search`, searchRequest, {
       params:{
            page,
            size,
            sort: 'publishAt,desc', 
        },
    });
};