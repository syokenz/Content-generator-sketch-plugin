// Fill with Picture Of (control command p)
// Fills selected layers with images tagged from Flickr
// by Nick Stamas @nickstamas

function onRun(context){
  var selection = context.selection;
  var doc = context.document;

  if (selection.length > 0) {
    var request = [[NSMutableURLRequest alloc] init];
    [request setHTTPMethod:@"GET"];
    var queryString = "https://kitchhike.com/api/photos_public";
    [request setURL:[NSURL URLWithString:queryString]];

    var error = [[NSError alloc] init];
    var responseCode = null;

    var oResponseData = [NSURLConnection sendSynchronousRequest:request returningResponse:responseCode error:error];

    var dataString = [[NSString alloc] initWithData:oResponseData
    encoding:NSUTF8StringEncoding];

    var pattern = new RegExp("\\\\'", "g");
    var validJSONString = dataString.replace(pattern, "'");
    var data = JSON.parse(validJSONString);


    if (data.items.length > 0) {
      for (var i=0; i <= selection.length; i++) {
        var randomIndex = Math.floor(Math.random()*(data.items.length-1));
        var imageURLString = data.items[randomIndex].photo;
        var url = [[NSURL alloc] initWithString: imageURLString];
        var newImage = [[NSImage alloc] initByReferencingURL:url];
        var layer = [selection objectAtIndex:i];
        var fill = layer.style().fills().firstObject();
        fill.setFillType(4);
        fill.setImage(MSImageData.alloc().initWithImage_convertColorSpace(newImage, false));
        fill.setPatternFillType(1);
      }
    } else {
      var message = "No images found tagged with: ";
      [doc showMessage: message];
    }
  }
}

