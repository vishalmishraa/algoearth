import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import ProblemParser from './Parser/Parser';
import generateFullC from './GenerateFullBoilerplate/generateFullC';
import generateFullJava from './GenerateFullBoilerplate/generateFullJava';
import generateFullRust from './GenerateFullBoilerplate/generateFullRust';
import generateFullPython from './GenerateFullBoilerplate/generateFullPython';
import generateFullJs from './GenerateFullBoilerplate/generateFullJs';
import GeneratePartial from './GeneratePartialBoilerplate/GeneratePartial';
dotenv.config();

// extract all the folders from problems directory and return them as an array in promise
const getFolders = (dirPath: string) => {
    return new Promise((resolve, reject) => {
        fs.readdir(dirPath, (err, files) => {
            if (err) {
                return reject(err);
            }
            const folers: string[] = [];
            let pending = files.length;
            files.forEach((file) => {
                const filePath = path.join(dirPath, file);
                fs.stat(filePath, (err, stat) => {
                    if (err) {
                        return reject(err);
                    }

                    if (stat.isDirectory()) {
                        folers.push(file);
                    }

                    if (!--pending) {
                        return resolve(folers);
                    }
                });
            });
        });
    });
}

function generatePartialBoilerplate(dirPath: string, folder: string) {
    const template = path.join(dirPath, folder, 'template.md');
    const boilerPlatePath = path.join(dirPath, folder, 'boilerplate');

    //read the template file
    const templateContent = fs.readFileSync(template, 'utf-8');

    //parse the template file and extract the boilerplate
    const parser = new ProblemParser();
    const data = parser.parse(templateContent);

    //generate the boilerplate
    const generatePartial = new GeneratePartial(data);

    const cppCode = generatePartial.generateCpp();
    const javaCode = generatePartial.generateJava();
    const rustCode = generatePartial.generateRust();
    const pythonCode = generatePartial.generatePython();
    const javascriptCode = generatePartial.generateJavascript();

    //check if boilerplate directory exists
    if (!fs.existsSync(boilerPlatePath)) {
        fs.mkdirSync(boilerPlatePath);
    };

    //write the boilerplate files
    fs.writeFileSync(path.join(boilerPlatePath, 'function.cpp'), cppCode);
    fs.writeFileSync(path.join(boilerPlatePath, 'function.java'), javaCode);
    fs.writeFileSync(path.join(boilerPlatePath, 'function.rs'), rustCode);
    fs.writeFileSync(path.join(boilerPlatePath, 'function.py'), pythonCode);
    fs.writeFileSync(path.join(boilerPlatePath, 'function.js'), javascriptCode);


    console.log(`Boilerplate generated for ${folder}`);
};

function generateFullBoilerPlate(dirPath: string, folder: string) {
    const template = path.join(dirPath, folder, 'template.md');
    const boilerPlatePath = path.join(dirPath, folder, 'boilerplate-full');

    //read the template file
    const templateContent = fs.readFileSync(template, 'utf-8');

    //parse the template file and extract the boilerplate
    const parser = new ProblemParser()
    const data = parser.parse(templateContent);

    //generate the boilerplate
    const cppCode = generateFullC(data)
    const javaCode = generateFullJava(data)
    const rustCode = generateFullRust(data);
    const pythonCode = generateFullPython(data)
    const javascriptCode = generateFullJs(data)

    //check if boilerplate directory exists
    if (!fs.existsSync(boilerPlatePath)) {
        fs.mkdirSync(boilerPlatePath);
    };

    //write the boilerplate files

    fs.writeFileSync(path.join(boilerPlatePath, 'function.cpp'), cppCode);
    fs.writeFileSync(path.join(boilerPlatePath, 'function.java'), javaCode);
    fs.writeFileSync(path.join(boilerPlatePath, 'function.rs'), rustCode);
    fs.writeFileSync(path.join(boilerPlatePath, 'function.py'), pythonCode);
    fs.writeFileSync(path.join(boilerPlatePath, 'function.js'), javascriptCode);

    console.log(`Full Boilerplate generated for ${folder}`);

}


if (!process.env.PROBLEMS_DIR_PATH) {
    console.log('PROBLEMS_DIR_PATH is not defined in .env file');
} else {
    getFolders(process.env.PROBLEMS_DIR_PATH).then((folders: any) => {
        folders.forEach((folder: string) => {
            generatePartialBoilerplate(process.env.PROBLEMS_DIR_PATH || "", folder);
            generateFullBoilerPlate(process.env.PROBLEMS_DIR_PATH || "", folder);
        });
    });

}