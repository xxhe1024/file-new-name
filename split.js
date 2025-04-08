const fs = require('fs');
const path = require('path');
const translate = require('translate-google');
const toPinyin = require('chinese-to-pinyin');

const folderPath = './切图';
const folderOut = './输出';

fs.readdir(folderPath, async (err, files) => {
    if (err) {
        console.error('Error reading folder:', err);
        return;
    }

    for (const file of files) {
        try {
            const filePath = path.join(folderPath, file);
            const fileName = path.basename(file);

            let englishName = await processFileName(fileName);
            englishName = formatEnglish(englishName);
            // console.log(englishName);

            // 重命名文件
            const newFilePath = path.join(folderOut, englishName);
            fs.copyFile(filePath, newFilePath, (err) => {
                if (err) {
                    console.error(`Error copying file ${fileName}:`, err);
                } else {
                    console.log(`Successfully copied ${fileName} to ${englishName}`);
                }
            });

        } catch (error) {
            console.error('Error translating or renaming file:', error);
        }

    }
});

// const processFileName = async (fileName) => {
//     // 先分离文件名和扩展名
//     const extName = path.extname(fileName);
//     const baseName = path.basename(fileName, extName);

//     // 将文件名分成中文和非中文部分
//     const parts = baseName.split(/([^a-zA-Z0-9_-]+)/);
    
//     // 处理每个部分：保留非中文部分，将中文转换为拼音
//     const processedParts = parts.map(part => {
//         if (/[^\x00-\xff]/.test(part)) {  // 检查是否包含中文字符
//             return toPinyin(part, {
//                 removeSpace: true,
//                 removeTone: true
//             });
//         }
//         return part;  // 保持非中文部分不变
//     });

//     // 合并处理后的文件名和扩展名
//     return (processedParts.join('') + extName).toLowerCase();
// }

const processFileName = async (fileName) => {
    // 先分离文件名和扩展名
    const extName = path.extname(fileName);
    const baseName = path.basename(fileName, extName);

    // 以_N_分割文件名，只取第一部分
    const mainName = baseName.split('_N_')[0];
    
    // 合并处理后的文件名和扩展名
    return ('img_' + mainName + extName).toLowerCase();
}

/**
 * 常见单词替换，避免文件名过长，后续有需求也可以继续添加
 */
const formatEnglish = (english) => {
    if (english?.includes('background')) {
        english = english.replaceAll('background', 'bg');
    }
    if (english?.includes('button')) {
        english = english.replaceAll('button', 'btn');
    }
    return english;
}