import { NextRequest, NextResponse } from "next/server";

const aws = require( 'aws-sdk' );
const multerS3 = require( 'multer-s3' );
const multer = require('multer');
const path = require( 'path' );

const s3 = new aws.S3({
	accessKeyId: 'AKIAS37RRKHCDGWFRQXH',
	secretAccessKey: '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',
	Bucket: 'project-backend-dev-files'
});

function checkFileType( file: any, cb: any ){
	const filetypes = /jpeg|jpg|png|gif/;
	const extname = filetypes.test( path.extname( file.originalname ).toLowerCase());
	const mimetype = filetypes.test( file.mimetype );

	if( mimetype && extname ){
		return cb( null, true );
	} else {
		cb( 'Error: Images Only!' );
	}
}

const fileUpload = multer({
	storage: multerS3({
		s3: s3,
		bucket: 'project-backend-dev-files',
        //key: 'historialies/579def48-98ff-4634-be9a-ac00d6965233/' + path.basename( file.originalname, path.extname( file.originalname ) )
		key: function (req: any, file: any, cb: any) {
			cb(null, 'historialies/579def48-98ff-4634-be9a-ac00d6965233/' + path.basename( file.originalname, path.extname( file.originalname ) ))
		}
	}),
	//limits:{ fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
	fileFilter: function( req: any, file: any, cb: any ){
		checkFileType( file, cb );
	}
}).single('file');

const upload = async (body: any) => {
    try {
        const params = {
            Bucket: 'project-backend-dev-files',
            Key: 'historiales/579def48-98ff-4634-be9a-ac00d6965233/meme.jpg',
            Body: body
        };

        //console.log(params)

        await s3.putObject(params).promise();

        //await s3.putObject()
    } catch (error) {
        console.log(error)
    }
}

export const POST = async (req: any, res: any) => {

	const body = req.body

	/*const params = {
		Bucket: 'project-backend-dev-files',
        Key: 'historiales/579def48-98ff-4634-be9a-ac00d6965233/' + req.name,
        Body: req.body,
		ContentType: req.type,
        ContentEncoding: 'base64',
	}*/

    /*fileUpload( req, res, ( error: any ) => {
		if( error ){
			console.log( 'errors', error );
			NextResponse.json( { error: error } );
		} else {
			if( req.body === undefined ){
				NextResponse.json( 'Error: No File Selected' );
			} else {
                const reader = req.body.getReader();

                new ReadableStream({
                    start(controller) {
                        function push() {
                            reader.read().then(( done: any, value: any ) => {
                                if (done) {
                                    upload(done.value)
                                    controller.close();
                                    return ;
                                }
                                
                                controller.enqueue(value);
                                push();
                            });
                        }

                        push();
                    }
                });
			}
		}
	});*/

    return NextResponse.json({ name: body.name }, { status: 200 });
}

/*import { NextResponse, NextRequest, NextFetchEvent } from "next/server";
import { createRouter, createEdgeRouter  } from "next-connect";

const aws = require( 'aws-sdk' );
const multerS3 = require( 'multer-s3' );
const multer = require('multer');
const path = require( 'path' );
const express = require( 'express' );

const s3 = new aws.S3({
	accessKeyId: 'AKIAS37RRKHCDGWFRQXH',
	secretAccessKey: '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',
	Bucket: 'project-backend-dev-files'
});

const router = express.Router();

function checkFileType( file: any, cb: any ){
	// Allowed ext
	const filetypes = /jpeg|jpg|png|gif/;
	// Check ext
	const extname = filetypes.test( path.extname( file.originalname ).toLowerCase());
	// Check mime
	const mimetype = filetypes.test( file.mimetype );
	if( mimetype && extname ){
		return cb( null, true );
	} else {
		cb( 'Error: Images Only!' );
	}
}

const profileImgUpload = multer({
	storage: multerS3({
		s3: s3,
		bucket: 'project-backend-dev-files',
		key: function (req: any, file: any, cb: any) {
			cb(null, path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + Date.now() + path.extname( file.originalname ) )
		}
	}),
	//limits:{ fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
	fileFilter: function( req: any, file: any, cb: any ){
		checkFileType( file, cb );
	}
}).single('file');

router.post('/file', async (req: any, res: any) => {
    //return NextResponse.json({ status: 200 })
    profileImgUpload( req, res, ( error: any ) => {
		console.log( 'requestOkokok', req.file );
		console.log( 'error', error );
		if( error ){
			console.log( 'errors', error );
			NextResponse.json( { error: error } );
		} else {
			// If File not found
			if( req.file === undefined ){
				console.log( 'Error: No File Selected!' );
				NextResponse.json( 'Error: No File Selected' );
			} else {
				// If Success
				const imageName = req.file.key;
				const imageLocation = req.file.location;
// Save the file name into database into profile model
                NextResponse.json( {
					image: imageName,
					location: imageLocation
				} );
			}
		}
	});
})*/

