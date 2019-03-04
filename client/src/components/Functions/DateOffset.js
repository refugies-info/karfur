const dateOffset = (date_initiale, day_offset = 0, hour_offset = 0) => {
  var date_finale = new Date(date_initiale.getTime());
  var dayInMilliseconds = 24 * 60 * 60 * 1000;
  var hourInMilliseconds = 60 * 60 * 1000;
  date_finale.setTime(date_initiale.getTime() 
                          + day_offset * dayInMilliseconds
                          + hour_offset * hourInMilliseconds);

  return date_finale
}

export default dateOffset;