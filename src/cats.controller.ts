import { Controller, Get, Post } from '@nestjs/common';
import * as xlsx from 'xlsx';
import { FileInterceptor } from '@nestjs/platform-express';
import { TfIdf } from 'natural';
import {Body} from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
  @Post('timkiem')
    findProduct(@Body() body) {
        //console.log(body.key)
        // đọc file csv
   
        const workbook = xlsx.readFile('D:\\nestjs_tutorial\\tichhop\\src\\fulldata.xls');
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
        const headerRow = jsonData[0] as string[];
        // đọc cột name 
        const columnData = jsonData.map(row => row[2]+' '+row[5]+' '+row[7]);
        //đẩy vào tf idf
        var keywordArray = body.key.split(" ");
        console.log(keywordArray);
        var arr= [];
        //tìm theo từ khóa , nếu xuất hiện thì có thêm 1 lần xuất hiện trong mảng
        for (let i = 0; i < jsonData.length; i++) {
            // Lấy giá trị của phần tử tại vị trí i
            keywordArray.forEach(element => {
                var temp = columnData[i].toLowerCase();
                if(temp.includes(element.toLowerCase())) arr.push(i)
            });
      
 
          }
          // đếm số lần xuất hiện của các từ trong từ khóa ứng với mỗi sản phẩm
          const countMap = arr.reduce((acc, curr) => {
            acc[curr] = (acc[curr] || 0) + 1;
            return acc;
          }, {});
         // chuyển danh sách 
          const entries = Object.entries(countMap);
          // thêm id các sản phẩm có chứa từ khóa
          var idList=[]
          entries.forEach(element =>{

            if (element[1] == keywordArray.length) idList.push(element[0])
          })

          // kết quả
          var list= []
          idList.forEach(id=>{
          list.push(jsonData[id])
        })
        // bỏ các sản phẩm trùng tên
        var result=[]
        result.push(list[0]);
        for (let i=1; i<list.length; i++){
          if (list[i][2] == list[i-1][2])  continue
          else result.push(list[i]);
        }
        return result;
}
}

