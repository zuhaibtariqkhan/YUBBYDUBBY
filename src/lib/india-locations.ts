/**
 * Comprehensive India Geographical Dataset: States, Union Territories, Major Cities,
 * and Postal / Phone Validation Helpers.
 */

export const INDIAN_STATES: string[] = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

export const STATE_CITIES_MAP: Record<string, string[]> = {
  "Jammu and Kashmir": [
    "Srinagar", "Jammu", "Anantnag", "Baramulla", "Sopore", "Pulwama", "Kupwara",
    "Budgam", "Ganderbal", "Kulgam", "Kathua", "Udhampur", "Poonch", "Rajouri",
    "Bandipora", "Shopian", "Samba", "Reasi", "Ramban", "Kishtwar", "Doda",
    "Akhnoor", "Pattan", "Bijbehara", "Tral", "Pampore", "Katra", "Bhaderwah"
  ],
  "Delhi": [
    "New Delhi", "Central Delhi", "North Delhi", "South Delhi", "East Delhi",
    "West Delhi", "Dwarka", "Rohini", "Connaught Place", "Vasant Kunj", "Saket",
    "Karol Bagh", "Pitampura", "Janakpuri", "Mayur Vihar", "Lajpat Nagar",
    "Shahdara", "Hauz Khas", "Greater Kailash", "Chandni Chowk", "Okhla"
  ],
  "Maharashtra": [
    "Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Chhatrapati Sambhajinagar",
    "Solapur", "Navi Mumbai", "Amravati", "Kolhapur", "Akola", "Panvel",
    "Ulhasnagar", "Kalyan-Dombivli", "Sangli", "Malegaon", "Jalgaon", "Nanded",
    "Latur", "Dhule", "Ahmednagar", "Chandrapur", "Parbhani", "Jalna", "Bhiwandi",
    "Satara", "Beed", "Yavatmal", "Wardha", "Baramati", "Ratnagiri", "Alibag"
  ],
  "Karnataka": [
    "Bengaluru", "Mysuru", "Hubballi-Dharwad", "Mangaluru", "Belagavi", "Davanagere",
    "Ballari", "Vijayapura", "Kalaburagi", "Shivamogga", "Tumakuru", "Raichur",
    "Bidar", "Hosapete", "Gadag", "Udupi", "Hassan", "Bhadravati", "Chitradurga",
    "Kolar", "Mandya", "Chikkamagaluru", "Bagalkote", "Karwar", "Madikeri"
  ],
  "Tamil Nadu": [
    "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli",
    "Tiruppur", "Erode", "Vellore", "Thoothukudi", "Dindigul", "Thanjavur",
    "Ranipet", "Sivakasi", "Karur", "Udhagamandalam", "Kanchipuram", "Nagercoil",
    "Cuddalore", "Kumbakonam", "Hosur", "Pudukkottai", "Nagapattinam", "Namakkal"
  ],
  "Uttar Pradesh": [
    "Lucknow", "Kanpur", "Varanasi", "Agra", "Prayagraj", "Ghaziabad", "Noida",
    "Greater Noida", "Meerut", "Bareilly", "Aligarh", "Moradabad", "Saharanpur",
    "Gorakhpur", "Firozabad", "Jhansi", "Muzaffarnagar", "Mathura", "Rampur",
    "Shahjahanpur", "Ayodhya", "Farrukhabad", "Hapur", "Etawah", "Mirzapur",
    "Bulandshahr", "Sambhal", "Amroha", "Hardoi", "Fatehpur", "Raebareli", "Orai"
  ],
  "Gujarat": [
    "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh",
    "Gandhinagar", "Anand", "Navsari", "Morbi", "Nadiad", "Surendranagar", "Bharuch",
    "Mehsana", "Bhuj", "Porbandar", "Vapi", "Valsad", "Godhra", "Patan", "Dahod",
    "Veraval", "Amreli", "Palanpur", "Botad", "Gandhidham"
  ],
  "West Bengal": [
    "Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Bardhaman", "Malda",
    "Baharampur", "Habra", "Kharagpur", "Shantipur", "Dankuni", "Dhulian", "Ranaghat",
    "Haldia", "Raiganj", "Krishnanagar", "Nabadwip", "Midnapore", "Jalpaiguri",
    "Darjeeling", "Balurghat", "Bankura", "Purulia", "Cooch Behar", "Alipurduar"
  ],
  "Telangana": [
    "Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Ramagundam", "Khammam",
    "Mahbubnagar", "Nalgonda", "Adilabad", "Suryapet", "Siddipet", "Miryalaguda",
    "Jagtial", "Mancherial", "Kothagudem", "Kamareddy", "Bodhan", "Sangareddy"
  ],
  "Kerala": [
    "Thiruvananthapuram", "Kochi", "Kozhikode", "Kollam", "Thrissur", "Kannur",
    "Alappuzha", "Kottayam", "Palakkad", "Manjeri", "Thalassery", "Ponnani",
    "Vatakara", "Kanhangad", "Malappuram", "Payyanur", "Koyilandy", "Neyyattinkara",
    "Kasaragod", "Muvattupuzha", "Changanassery", "Kayamkulam", "Perinthalmanna"
  ],
  "Rajasthan": [
    "Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar",
    "Bharatpur", "Sikar", "Pali", "Sri Ganganagar", "Hanumangarh", "Beawar",
    "Kishangarh", "Jhunjhunu", "Churu", "Barmer", "Nagaur", "Tonk", "Banswara",
    "Dausa", "Chittorgarh", "Sawai Madhopur", "Jaisalmer", "Bundi"
  ],
  "Punjab": [
    "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali",
    "Hoshiarpur", "Batala", "Pathankot", "Moga", "Abohar", "Malerkotla", "Khanna",
    "Phagwara", "Muktsar", "Barnala", "Firozpur", "Kapurthala", "Sangrur", "Fazilka"
  ],
  "Haryana": [
    "Gurugram", "Faridabad", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar",
    "Karnal", "Sonipat", "Panchkula", "Sirsa", "Bhiwani", "Bahadurgarh", "Jind",
    "Thanesar", "Kaithal", "Rewari", "Palwal", "Hansi", "Fatehabad", "Narnaul"
  ],
  "Bihar": [
    "Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Bihar Sharif",
    "Arrah", "Begusarai", "Katihar", "Munger", "Chhapra", "Danapur", "Saharsa",
    "Sasaram", "Hajipur", "Dehri", "Bettiah", "Motihari", "Bagaha", "Siwan", "Kishanganj"
  ],
  "Madhya Pradesh": [
    "Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna",
    "Ratlam", "Rewa", "Murwara", "Singrauli", "Burhanpur", "Khandwa", "Bhind",
    "Chhindwara", "Guna", "Shivpuri", "Vidisha", "Damoh", "Mandsaur", "Khargone", "Neemuch"
  ],
  "Andhra Pradesh": [
    "Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Kakinada",
    "Rajamahendravaram", "Tirupati", "Kadapa", "Anantapur", "Vizianagaram", "Eluru",
    "Ongole", "Nandyal", "Machilipatnam", "Adoni", "Tenali", "Proddatur", "Chittoor", "Hindupur"
  ],
  "Assam": [
    "Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur",
    "Bongaigaon", "Karimganj", "Sivasagar", "Goalpara", "North Lakhimpur", "Dhubri"
  ],
  "Odisha": [
    "Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri",
    "Balasore", "Bhadrak", "Baripada", "Jharsuguda", "Jeypore", "Bargarh", "Angul"
  ],
  "Chhattisgarh": [
    "Raipur", "Bhilai", "Bilaspur", "Korba", "Rajnandgaon", "Raigarh", "Jagdalpur",
    "Ambikapur", "Dhamtari", "Mahasamund", "Durg"
  ],
  "Jharkhand": [
    "Ranchi", "Jamshedpur", "Dhanbad", "Bokaro Steel City", "Deoghar", "Phusro",
    "Hazaribagh", "Giridih", "Ramgarh", "Medininagar", "Chirkunda", "Chaibasa"
  ],
  "Uttarakhand": [
    "Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Kashipur",
    "Rishikesh", "Nainital", "Mussoorie", "Pithoragarh", "Kotdwar", "Almora"
  ],
  "Himachal Pradesh": [
    "Shimla", "Dharamshala", "Solan", "Mandi", "Kullu", "Manali", "Baddi",
    "Nahan", "Una", "Hamirpur", "Bilaspur", "Chamba", "Palampur", "Paonta Sahib"
  ],
  "Goa": [
    "Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Bicholim",
    "Curchorem", "Cuncolim", "Valpoi", "Sanquelim"
  ],
  "Chandigarh": [
    "Chandigarh"
  ],
  "Ladakh": [
    "Leh", "Kargil", "Diskit", "Padum", "Nubra"
  ],
  "Tripura": [
    "Agartala", "Dharmanagar", "Udaipur", "Kailashahar", "Belonia", "Khowai"
  ],
  "Meghalaya": [
    "Shillong", "Tura", "Jowai", "Nongpoh", "Cherrapunji", "Williamnagar"
  ],
  "Manipur": [
    "Imphal", "Churachandpur", "Thoubal", "Bishnupur", "Ukhrul", "Kakching"
  ],
  "Nagaland": [
    "Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Mon", "Zunheboto"
  ],
  "Mizoram": [
    "Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib", "Lawngtlai"
  ],
  "Sikkim": [
    "Gangtok", "Namchi", "Geyzing", "Mangan", "Rangpo", "Jorethang"
  ],
  "Arunachal Pradesh": [
    "Itanagar", "Naharlagun", "Pasighat", "Tawang", "Ziro", "Tezu", "Bomdila"
  ],
  "Andaman and Nicobar Islands": [
    "Port Blair", "Diglipur", "Car Nicobar", "Havelock Island", "Mayabunder"
  ],
  "Dadra and Nagar Haveli and Daman and Diu": [
    "Daman", "Diu", "Silvassa", "Amli"
  ],
  "Lakshadweep": [
    "Kavaratti", "Agatti", "Andrott", "Amini", "Minicoy"
  ],
  "Puducherry": [
    "Puducherry", "Karaikal", "Mahe", "Yanam", "Ozhukarai"
  ],
};

/**
 * Returns all Indian States and Union Territories.
 */
export function getIndianStates(): string[] {
  return INDIAN_STATES;
}

/**
 * Returns cities for a given Indian State or UT.
 */
export function getCitiesForState(stateName: string): string[] {
  if (!stateName) return [];
  // Case-insensitive match
  const matchedKey = Object.keys(STATE_CITIES_MAP).find(
    (key) => key.toLowerCase() === stateName.trim().toLowerCase()
  );
  return matchedKey ? STATE_CITIES_MAP[matchedKey] : [];
}

/**
 * Searches cities with optional state filtering.
 */
export function searchCities(query: string, selectedState?: string, limit: number = 8): Array<{ city: string; state: string }> {
  const cleanQuery = (query || "").trim().toLowerCase();
  if (!cleanQuery) return [];

  const results: Array<{ city: string; state: string }> = [];

  // If a state is selected, search within that state first
  if (selectedState && STATE_CITIES_MAP[selectedState]) {
    for (const city of STATE_CITIES_MAP[selectedState]) {
      if (city.toLowerCase().includes(cleanQuery)) {
        results.push({ city, state: selectedState });
        if (results.length >= limit) return results;
      }
    }
    return results;
  }

  // Otherwise, search across all states in India
  for (const [state, cities] of Object.entries(STATE_CITIES_MAP)) {
    for (const city of cities) {
      if (city.toLowerCase().includes(cleanQuery)) {
        results.push({ city, state });
        if (results.length >= limit) return results;
      }
    }
  }

  return results;
}

/**
 * Validates 6-digit Indian PIN Code:
 * Must be 6 digits, numeric only, cannot start with 0.
 */
export function isValidIndianPinCode(pincode: string): boolean {
  if (!pincode) return false;
  const cleanPin = pincode.trim();
  return /^[1-9][0-9]{5}$/.test(cleanPin);
}

/**
 * Cleans phone number by removing spaces, dashes, parentheses and +91 prefix.
 */
export function cleanIndianPhone(phone: string): string {
  if (!phone) return "";
  let digits = phone.replace(/\D/g, "");
  // If user entered +91 or 91 with 12 digits, strip country code
  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.substring(2);
  } else if (digits.length === 11 && digits.startsWith("0")) {
    // Strip leading 0
    digits = digits.substring(1);
  }
  return digits;
}

/**
 * Validates 10-digit Indian Mobile Number:
 * Must be exactly 10 digits starting with 6, 7, 8, or 9.
 */
export function isValidIndianPhone(phone: string): boolean {
  const cleaned = cleanIndianPhone(phone);
  return /^[6-9]\d{9}$/.test(cleaned);
}

/**
 * Checks if the state is recognized in the official 28 States + 8 UTs list.
 */
export function isValidIndianState(state: string): boolean {
  if (!state) return false;
  const clean = state.trim().toLowerCase();
  return INDIAN_STATES.some((s) => s.toLowerCase() === clean);
}
