import { NextResponse } from 'next/server';
     import axios from 'axios';

     export async function GET() {
       try {
         const response = await axios.get(
           'https://raw.githubusercontent.com/hotsooc/discord---bot---data/main/user_choices.json',
           {
             headers: {
               'Cache-Control': 'no-cache',
               'Pragma': 'no-cache',
               'Expires': '0',
             },
           }
         );
         return NextResponse.json(response.data);
       } catch (error: any) {
         console.error('Lỗi khi lấy dữ liệu từ GitHub:', error.message);
         return NextResponse.json(
           { error: 'Không thể lấy dữ liệu từ GitHub' },
           { status: 500 }
         );
       }
     }