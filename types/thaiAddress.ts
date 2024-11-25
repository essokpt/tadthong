export interface ThaiAddress {
    id: number;
    tambonThai: string;
    districtThai: string;
    provinceThai: string;
    postCode: string;
  }
  
  export interface SearchResponse {
    thaiAddresses: ThaiAddress[];
   
  }