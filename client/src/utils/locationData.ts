export interface PopularCity {
    name: string;
    available: boolean;
    icon: string;
    state: string;
}

export const POPULAR_CITIES: PopularCity[] = [
    { name: 'Kochi', available: true, icon: '🌴', state: 'Kerala' },
    { name: 'Mumbai', available: false, icon: '🏛️', state: 'Maharashtra' },
    { name: 'Delhi-NCR', available: false, icon: '🏛️', state: 'Delhi' },
    { name: 'Bengaluru', available: false, icon: '🏛️', state: 'Karnataka' },
    { name: 'Hyderabad', available: false, icon: '🕌', state: 'Telangana' },
    { name: 'Chandigarh', available: false, icon: '🏛️', state: 'Punjab' },
    { name: 'Ahmedabad', available: false, icon: '🕌', state: 'Gujarat' },
    { name: 'Pune', available: false, icon: '🏛️', state: 'Maharashtra' },
    { name: 'Chennai', available: false, icon: '🛕', state: 'Tamil Nadu' },
    { name: 'Kolkata', available: false, icon: '🏛️', state: 'West Bengal' }
];

// Main prominent district hubs shown by default when search is empty
export const MAIN_DISTRICTS: string[] = [
    // Kerala
    'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam', 'Kottayam', 
    'Kozhikode', 'Malappuram', 'Palakkad', 'Pathanamthitta', 'Thiruvananthapuram', 'Thrissur', 'Wayanad',
    // Major national district centers
    'Agra', 'Ahmedabad', 'Ajmer', 'Amritsar', 'Aurangabad', 'Belagavi', 'Bhopal', 
    'Bhubaneswar', 'Bikaner', 'Coimbatore', 'Cuttack', 'Dehradun', 'Dhanbad', 'Gaya', 
    'Gwalior', 'Haridwar', 'Hubballi', 'Indore', 'Jabalpur', 'Jaipur', 'Jalandhar', 
    'Jamshedpur', 'Jodhpur', 'Kanpur', 'Kota', 'Ludhiana', 'Lucknow', 'Madurai', 
    'Mangaluru', 'Meerut', 'Mysuru', 'Nagpur', 'Nashik', 'Panaji', 'Patna', 
    'Prayagraj', 'Raipur', 'Rajkot', 'Ranchi', 'Rourkela', 'Salem', 'Shimla', 
    'Srinagar', 'Surat', 'Thane', 'Tiruchirappalli', 'Udaipur', 'Vadodara', 'Varanasi', 
    'Vijayawada', 'Visakhapatnam', 'Warangal'
];

// Comprehensive catalog of Indian districts across all States and Union Territories for search
export const ALL_INDIA_DISTRICTS: string[] = [
    // Kerala
    'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam', 'Kottayam', 
    'Kozhikode', 'Kovalam', 'Malappuram', 'Munnar', 'Palakkad', 'Pathanamthitta', 
    'Thiruvananthapuram', 'Thrissur', 'Wayanad', 'Kochi',
    // Tamil Nadu
    'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 
    'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur', 
    'Krishnagiri', 'Madurai', 'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 
    'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 
    'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 
    'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore', 
    'Viluppuram', 'Virudhunagar',
    // Karnataka
    'Bagalkote', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban', 'Bidar', 
    'Chamarajanagar', 'Chikkaballapura', 'Chikkamagaluru', 'Chitradurga', 'Dakshina Kannada', 
    'Davanagere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri', 'Kalaburagi', 'Kodagu', 
    'Kolar', 'Koppal', 'Mandya', 'Mangaluru', 'Mysuru', 'Raichur', 'Ramanagara', 
    'Shivamogga', 'Tumakuru', 'Udupi', 'Uttara Kannada', 'Vijayapura', 'Vijayanagara', 'Yadgir',
    // Maharashtra
    'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad (Chhatrapati Sambhajinagar)', 'Beed', 
    'Bhandara', 'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 
    'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 
    'Nanded', 'Nandurbar', 'Nashik', 'Osmanabad (Dharashiv)', 'Palghar', 'Parbhani', 
    'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 
    'Thane', 'Wardha', 'Washim', 'Yavatmal',
    // Andhra Pradesh & Telangana
    'Adilabad', 'Alluri Sitharama Raju', 'Anakapalli', 'Ananthapuramu', 'Annamayya', 
    'Bapatla', 'Bhadradri Kothagudem', 'Chittoor', 'Dr. B.R. Ambedkar Konaseema', 
    'East Godavari', 'Eluru', 'Guntur', 'Hanamkonda', 'Hyderabad', 'Jagtial', 'Jangaon', 
    'Jayashankar Bhupalpally', 'Jogulamba Gadwal', 'Kakinada', 'Kamareddy', 'Karimnagar', 
    'Khammam', 'Krishna', 'Kumuram Bheem Asifabad', 'Kurnool', 'Mahabubabad', 
    'Mahabubnagar', 'Mancherial', 'Medak', 'Medchal-Malkajgiri', 'Mulugu', 'Nagarkurnool', 
    'Nalgonda', 'Nandyal', 'Narayanpet', 'Nirmal', 'Nizamabad', 'NTR', 'Palnadu', 
    'Parvathipuram Manyam', 'Peddapalli', 'Prakasam', 'Rajanna Sircilla', 'Ranga Reddy', 
    'Sangareddy', 'Siddipet', 'Sri Potti Sriramulu Nellore', 'Sri Sathya Sai', 
    'Srikakulam', 'Suryapet', 'Tirupati', 'Vikarabad', 'Visakhapatnam', 'Vizianagaram', 
    'Wanaparthy', 'Warangal', 'West Godavari', 'Yadadri Bhuvanagiri', 'YSR Kadapa',
    // Gujarat
    'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch', 'Bhavnagar', 
    'Botad', 'Chhota Udaipur', 'Dahod', 'Dang', 'Devbhoomi Dwarka', 'Gandhinagar', 
    'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kheda', 'Kutch', 'Mahisagar', 'Mehsana', 
    'Morbi', 'Narmada', 'Navsari', 'Panchmahal', 'Patan', 'Porbandar', 'Rajkot', 
    'Sabarkantha', 'Surat', 'Surendranagar', 'Tapi', 'Vadodara', 'Valsad',
    // Rajasthan
    'Ajmer', 'Alwar', 'Anupgarh', 'Balotra', 'Banswara', 'Baran', 'Barmer', 'Beawar', 
    'Bharatpur', 'Bhilwara', 'Bikaner', 'Bundi', 'Chittorgarh', 'Churu', 'Dausa', 
    'Deeg', 'Dholpur', 'Didwana-Kuchaman', 'Dudu', 'Dungarpur', 'Ganganagar', 
    'Gangapur City', 'Hanumangarh', 'Jaipur', 'Jaisalmer', 'Jalore', 'Jhalawar', 
    'Jhunjhunu', 'Jodhpur', 'Karauli', 'Kekri', 'Khairthal-Tijara', 'Kota', 
    'Kotputli-Behror', 'Nagaur', 'Neem Ka Thana', 'Pali', 'Phalodi', 'Pratapgarh', 
    'Rajsamand', 'Salumbar', 'Sanchore', 'Sawai Madhopur', 'Shahpura', 'Sikar', 
    'Sirohi', 'Tonk', 'Udaipur',
    // Uttar Pradesh
    'Agra', 'Aligarh', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Ayodhya', 
    'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 
    'Bareilly', 'Basti', 'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 
    'Chitrakoot', 'Deoria', 'Etah', 'Etawah', 'Farrukhabad', 'Fatehpur', 'Firozabad', 
    'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 
    'Hapur', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj', 
    'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kheri', 'Kushinagar', 
    'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura', 'Mau', 
    'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh', 
    'Prayagraj', 'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 
    'Shahjahanpur', 'Shamli', 'Shrawasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra', 
    'Sultanpur', 'Unnao', 'Varanasi',
    // Madhya Pradesh
    'Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashoknagar', 'Balaghat', 'Barwani', 'Betul', 
    'Bhind', 'Bhopal', 'Burhanpur', 'Chhatarpur', 'Chhindwara', 'Damoh', 'Datia', 
    'Dewas', 'Dhar', 'Dindori', 'Guna', 'Gwalior', 'Harda', 'Hoshangabad (Narmadapuram)', 
    'Indore', 'Jabalpur', 'Jhabua', 'Katni', 'Khandwa', 'Khargone', 'Mandla', 
    'Mandsaur', 'Morena', 'Narsinghpur', 'Neemuch', 'Niwari', 'Panna', 'Raisen', 
    'Rajgarh', 'Ratlam', 'Rewa', 'Sagar', 'Satna', 'Sehore', 'Seoni', 'Shahdol', 
    'Shajapur', 'Sheopur', 'Shivpuri', 'Sidhi', 'Singrauli', 'Tikamgarh', 'Ujjain', 
    'Umaria', 'Vidisha',
    // West Bengal
    'Alipurduar', 'Bankura', 'Birbhum', 'Cooch Behar', 'Dakshin Dinajpur', 'Darjeeling', 
    'Hooghly', 'Howrah', 'Jalpaiguri', 'Jhargram', 'Kalimpong', 'Kolkata', 'Malda', 
    'Murshidabad', 'Nadia', 'North 24 Parganas', 'Paschim Bardhaman', 'Paschim Medinipur', 
    'Purba Bardhaman', 'Purba Medinipur', 'Purulia', 'South 24 Parganas', 'Uttar Dinajpur',
    // Bihar & Jharkhand
    'Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur', 
    'Buxar', 'Darbhanga', 'East Champaran', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad', 
    'Kaimur', 'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura', 
    'Madhubani', 'Munger', 'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 'Purnia', 
    'Rohtas', 'Saharsa', 'Samastipur', 'Saran', 'Sheikhpura', 'Sheohar', 'Sitamarhi', 
    'Siwan', 'Supaul', 'Vaishali', 'West Champaran', 'Bokaro', 'Chatra', 'Deoghar', 
    'Dhanbad', 'Dumka', 'East Singhbhum', 'Garhwa', 'Giridih', 'Godda', 'Gumla', 
    'Hazaribagh', 'Jamtara', 'Khunti', 'Koderma', 'Latehar', 'Lohardaga', 'Pakur', 
    'Palamu', 'Ramgarh', 'Ranchi', 'Sahebganj', 'Seraikela Kharsawan', 'Simdega', 'West Singhbhum',
    // Punjab & Haryana
    'Ambala', 'Amritsar', 'Barnala', 'Bathinda', 'Bhiwani', 'Charkhi Dadri', 'Faridabad', 
    'Faridkot', 'Fatehabad', 'Fatehgarh Sahib', 'Fazilka', 'Ferozepur', 'Gurdaspur', 
    'Gurugram', 'Hisar', 'Hoshiarpur', 'Jalandhar', 'Jhajjar', 'Jind', 'Kaithal', 
    'Kapurthala', 'Karnal', 'Kurukshetra', 'Ludhiana', 'Mahendragarh', 'Malerkotla', 
    'Mansa', 'Moga', 'Mohali', 'Muktsar', 'Nuh', 'Palwal', 'Panchkula', 'Panipat', 
    'Pathankot', 'Patiala', 'Rewari', 'Rohtak', 'Rupnagar', 'Sangrur', 'SBS Nagar', 
    'Sirsa', 'Sonipat', 'Tarn Taran', 'Yamunanagar',
    // Odisha & Chhattisgarh
    'Angul', 'Balangir', 'Balasore', 'Bargarh', 'Bhadrak', 'Boudh', 'Cuttack', 'Deogarh', 
    'Dhenkanal', 'Gajapati', 'Ganjam', 'Jagatsinghpur', 'Jajpur', 'Jharsuguda', 'Kalahandi', 
    'Kandhamal', 'Kendrapara', 'Kendujhar', 'Khordha', 'Koraput', 'Malkangiri', 'Mayurbhanj', 
    'Nabarangpur', 'Nayagarh', 'Nuapada', 'Puri', 'Rayagada', 'Sambalpur', 'Subarnapur', 
    'Sundergarh', 'Balod', 'Baloda Bazar', 'Balrampur', 'Bastar', 'Bemetara', 'Bijapur', 
    'Bilaspur', 'Dantewada', 'Dhamtari', 'Durg', 'Gariaband', 'Janjgir-Champa', 'Jashpur', 
    'Kabirdham', 'Kanker', 'Khairagarh', 'Kondagaon', 'Korba', 'Koriya', 'Mahasamund', 
    'Mungeli', 'Narayanpur', 'Raigarh', 'Raipur', 'Rajnandgaon', 'Sakti', 'Sukma', 'Surajpur', 'Surguja',
    // Uttarakhand, Himachal Pradesh, Goa, J&K, Ladakh & Northeast
    'Almora', 'Bageshwar', 'Chamoli', 'Champawat', 'Dehradun', 'Haridwar', 'Nainital', 
    'Pauri Garhwal', 'Pithoragarh', 'Rudraprayag', 'Tehri Garhwal', 'Udham Singh Nagar', 
    'Uttarkashi', 'Bilaspur', 'Chamba', 'Hamirpur', 'Kangra', 'Kinnaur', 'Kullu', 
    'Mandi', 'Shimla', 'Sirmaur', 'Solan', 'Una', 'North Goa', 'South Goa', 'Panaji', 
    'Anantnag', 'Bandipora', 'Baramulla', 'Budgam', 'Doda', 'Ganderbal', 'Jammu', 
    'Kathua', 'Kishtwar', 'Kulgam', 'Kupwara', 'Poonch', 'Pulwama', 'Rajouri', 
    'Ramban', 'Reasi', 'Samba', 'Shopian', 'Srinagar', 'Udhampur', 'Kargil', 'Leh', 
    'Agartala', 'Aizawl', 'Imphal', 'Kohima', 'Dimapur', 'Shillong', 'Itanagar', 'Gangtok'
];
