# REST Product Label Generator & Print Server
A script that we use at [sizable.se](https://sizable.se) that listens for POST requests with a json payload, creates an product label and prints the label on a label printer.

After a lot of trial and error, I can only get this setup to work on `Microsoft Windows` (win10 in my case).

## Incomming json request payload
```json
POST /print
{
    "title": "Apple iPhone 15 Pro",
    "variant": "64GB Midnight Green",
    "id": "P.RF3I4",
    "amount": 1, // number on label
    "amount_of_labels": 1, // how many labels to print
}
```

## Program procedure
1. Request comes in at `/print` with json body specified as above
2. Creates a unique ID based on the input payload
3. Checks the cache using ID
4. If not cached, generate a new label and save in cache
5. Print label(s) using `IrfanView`

# Prerequisites
1. [IrfanView](https://www.irfanview.com/)
2. [nodejs](https://nodejs.org/)
3. `pm2` (optional but recommended)

## Tested hardware
✅ Brother QL-570 label printer (`62x29mm` labels)

## IrfanView + QL-570 + 62x29mm
I use these printer settings. You probably need to change them if you don't use the exact configuration I do.
![IrfanView setting](https://github.com/webjocke/product-label-print-server/blob/master/IrfanView-printer-settings.png?raw=true)


## How to run it
`npm install`

`pm2 start index.js`

## Note
The `/images` folder is currently just growing without control. Each images is roughly 100kB big and there is no logic for removing anything yet. On the upside, there is a high chance of a cache hit, even when printing the same label year in between. 🙃

## License
Feel free to fork and modify as you please. I give no guarantees of cource.