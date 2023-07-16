import {generateReactHelpers} from '@uploadthing/react/hooks';

import type {OurFileRouter} from '@/app/api/uploadthing/core';

//function that lets us upload files and it works with the actual router defined in core.ts
export const {uploadFiles} = generateReactHelpers<OurFileRouter>();