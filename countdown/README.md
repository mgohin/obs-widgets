# Countdown OBS timer


## Query params

| Name | Possible value(s)  | Default  | Example  | Note |
|---|---|---|---|---|
| date | `YYYY-MM-DDTHH:mm:ss.sssZ` | none | `date=2024-11-27T00:49:20.354Z` | If no valid date is provided an error will be shown|
| text-color | any css valid color value | `#000` | `text-color=red` ||
| show | `days hours minutes secondes` | `days,hours,minutes,secondes` | `show=seconds,    days,   minutes;   ` | values can be separated by space(s) and/or`;,`|


Exemple: `...&date=2024-11-27T00:49:20.354Z&text-color=red&show=minutes,secondes`