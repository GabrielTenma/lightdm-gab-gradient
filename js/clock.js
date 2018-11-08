function startTime()
{
	var today = new Date();
	hours = today.getHours();
	minutes = today.getMinutes();
	seconds = today.getSeconds();

	document.getElementById("clock-box").innerHTML = pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
	setTimeout('startTime()', 1000);
}

function pad(to_pad)
{
	return to_pad > 9 ? to_pad : "0"+to_pad;
}
