// Fill with Picture Of (control command p)
// Fills selected layers with images tagged from Flickr
// by Nick Stamas @nickstamas

function onRun(context){
  var selection = context.selection;
  var doc = context.document;

  if (selection.length > 0) {
    var alert = [NSAlert alertWithMessageText: "select target:"
    defaultButton:"OK"
    alternateButton:"Cancel"
    otherButton:nil
    informativeTextWithFormat:""];

		var select = [[NSComboBox alloc] initWithFrame:NSMakeRect(0,0,200,25)];
    var options = ["Pop-Up", "COOK", "HIKER", "Gallery"];
    var query_options = ["popup", "cook", "hiker", "gallery"];
		select.i18nObjectValues = options;
		select.setEditable(false);
		select.addItemsWithObjectValues(options);
		select.selectItemAtIndex(0);
    [alert setAccessoryView:select];
    var button = [alert runModal];

    if (button == NSAlertDefaultReturn) {
      var target = query_options[[select indexOfSelectedItem]];
      var request = [[NSMutableURLRequest alloc] init];
      [request setHTTPMethod:@"GET"];
      var queryString = "https://kitchhike.com/api/photos_public?target=" + target;
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
  } else {
    [doc showMessage:"No layer is selected."];
  }
}

