# shelly-scripts

Shelly Scripts for devices like Shelly Plug S Gen3

## Shelly Plug S Gen3

### Script: LED Light match Tauron G13s tariff

The LED light matches Tauron G13s tariff.

![Tauron G13s tariff hours](images/g13s-tariff-hours.png)

For clarity between yellow & `rgb(255, 50, 0)` orange colors, we use `rgb(0, 255, 255)` light blue for the night tariff. You can use the LED as a night light then.

In winter weekend we use `rgb(0, 255, 0)` dark green for the cheapest period, because that's the cheapest you can get during winter.

Summer has two green colors:

* `rgb(0, 255, 50)` light green - for cheap hours during workdays
* `rgb(0, 255, 0)` dark green - for the cheapest hours during weekend

__Configuration of the scripts:__

Ensure `Run on startup` is ON for the script added to your Shelly PlugS Gen3 device in settings: http://192.168.1.57/#/scripts (use your Shelly device IP to connect).


### Script: Temperature Checker

Check the device temperature every 10 seconds and show in diagnostics logs.
