# Form handler for any client based on url parmaters

## Getting Started

`/candidate-apply/[company]` based on company name the image and names will be loaded though a server side request.

If we get `Error 503` that means the error is caused while fetching the branches and openings.<br>
If we get `Error 404` that means the `[company]` field passed is not valid.

First, run the development server:

```bash
npm run dev
# or
yarn dev
```
