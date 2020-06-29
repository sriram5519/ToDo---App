import React from 'react';

import { useMutation } from '@apollo/react-hooks';
import { UPLOAD_FILE } from '../graphql/queries';

const Upload = (props) => {
    const [uploadFile] = useMutation(UPLOAD_FILE, {
        onError: (err) => {
            console.log(err);
        }
    });

    const handleFile = (e) => {
        console.log(e.target.files[0]);
        
        uploadFile({
            variables: {
                file: e.target.files[0]
            }
        })
    }

    return (
        <div>
            <input type='file' onChange={handleFile} style={{marginTop: '150px'}} />
        </div>
    )
}

export default Upload;