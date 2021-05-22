sortSources(sources) {
  let media = [];
  let media2 = [];
  sources.forEach((item) => {
    if (media.indexOf(item.medium) === -1) {
      media.push(item.medium);
    }
    // If media has day, add to array
    if (item.day) {
      media.push(item.day);
    }
    // If media has a page number, add to array
    if (item.pageNumber) {
      media.push(item.pageNumber);
    }
  });
  console.log(media);
}

sortSources(sources) {
  let media = [];
  let mediaCollection = [];
  sources.forEach((item) => {
    // If newspaper name DOES NOT already exists in array ADD IT
    if (media.indexOf(item.medium) === -1) {
      media.push(item.medium);
    }
  });

  media.forEach((item) => {
    let pagesArray = [];
    let daysArray = [];
    for (let i = 0; i < sources.length; i++) {
      if (item === sources[i].medium) {
        // If object contains day
        if (sources[i].day) {
          pagesArray.push(sources[i].pageNumber);
          daysArray.push(sources[i].day);
        } else {
          pagesArray.push(sources[i].pageNumber);
        }
      }
    }
    console.log("Pages array:", pagesArray);
    console.log("Days array:", daysArray);

    let mediaObj = {
      media: item,
      pages: pagesArray,
    };

    mediaCollection.push(mediaObj);
  });
  console.log(mediaCollection);
},