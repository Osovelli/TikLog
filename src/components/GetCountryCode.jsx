import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCountries, getCountryCallingCode } from 'libphonenumber-js';
import * as flagIcons from 'country-flag-icons/react/3x2';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from './ui/command';
import { cn } from '@/lib/utils';

// Get metadata about countries
const getCountryName = (countryCode) => {
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(countryCode);
  } catch (error) {
    return countryCode;
  }
};

// Get all countries and their data
const countries = getCountries()
  .map(country => {
    const FlagComponent = flagIcons[country];
    return {
      code: `+${getCountryCallingCode(country)}`,
      country,
      name: getCountryName(country),
      FlagComponent
    };
  })
  .filter(country => country.FlagComponent) // Ensure we have a flag
  .sort((a, b) => a.name.localeCompare(b.name));

const CountryCodeSelect = React.forwardRef(({ 
  onChange, 
  value = "+234", // Default to Nigeria
  className,
  ...props 
}, ref) => {
  const selectedCountry = countries.find(c => c.code === value) || countries[0];
  const FlagComponent = selectedCountry.FlagComponent;

  return (
    <Select onValueChange={onChange} value={value} {...props}>
      <SelectTrigger 
        ref={ref}
        className="w-[110px] border-r-0 rounded-r-none focus:ring-0 focus:ring-offset-0"
      >
        <SelectValue>
          <span className="flex items-center gap-2">
            <FlagComponent className="w-5 h-4" />
            <span>{selectedCountry.code}</span>
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        {countries.map(({ code, name, FlagComponent }) => (
          <SelectItem 
            key={code} 
            value={code}
            className="cursor-pointer py-2"
          >
            <div className="flex items-center gap-2">
              <FlagComponent className="w-5 h-4" />
              <div className="flex flex-col">
                <span className="font-medium">{name}</span>
                <span className="text-sm text-muted-foreground">{code}</span>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
});

CountryCodeSelect.displayName = "CountryCodeSelect";

export default CountryCodeSelect;

/* const getCountryName = (countryCode) => {
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(countryCode)
  } catch (error) {
    return countryCode
  }
}

const countries = getCountries()
  .map(country => {
    const FlagComponent = flagIcons[country]
    return {
      code: `+${getCountryCallingCode(country)}`,
      country,
      name: getCountryName(country),
      FlagComponent
    }
  })
  .filter(country => country.FlagComponent)
  .sort((a, b) => a.name.localeCompare(b.name))

const CountrySelect = React.forwardRef(({ value, onChange, ...props }, ref) => {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const selectedCountry = countries.find(c => c.code === value) || countries[0]
  const FlagComponent = selectedCountry.FlagComponent

  const filteredCountries = countries.filter(country => 
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.code.includes(searchQuery)
  )

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[110px] justify-between px-3 font-normal border-r-0 rounded-r-none focus:ring-0 focus:ring-offset-0"
        >
          <span className="flex items-center gap-2">
            {FlagComponent && <FlagComponent className="w-5 h-4" />}
            <span>{value}</span>
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            placeholder="Search country..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandEmpty>No country found.</CommandEmpty>
          <CommandGroup className="max-h-[200px] overflow-y-auto">
            {filteredCountries.map(({ code, name, FlagComponent, country }) => (
              <CommandItem
                key={country}
                onSelect={() => {
                  onChange(code)
                  setOpen(false)
                  setSearchQuery('')
                }}
                className="cursor-pointer"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === code ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex items-center gap-2">
                  {FlagComponent && <FlagComponent className="w-5 h-4" />}
                  <div className="flex flex-col">
                    <span className="font-medium">{name}</span>
                    <span className="text-sm text-muted-foreground">{code}</span>
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
})

CountrySelect.displayName = "CountrySelect"

export {CountrySelect} */