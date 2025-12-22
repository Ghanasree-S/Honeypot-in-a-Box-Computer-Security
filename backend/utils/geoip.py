import geoip2.database
import os

def get_location(ip_address):
    """Get location info including coordinates for map display"""
    
    # Handle localhost and private IPs
    if ip_address in ['127.0.0.1', 'localhost', '::1']:
        return {
            "country": "Local Network",
            "city": "Testing",
            "lat": 0,
            "lon": 0
        }
    
    # Check for private IP ranges
    if ip_address.startswith(('192.168.', '10.', '172.16.', '172.17.', '172.18.', '172.19.', '172.20.', '172.21.', '172.22.', '172.23.', '172.24.', '172.25.', '172.26.', '172.27.', '172.28.', '172.29.', '172.30.', '172.31.')):
        return {
            "country": "Private Network",
            "city": "Internal",
            "lat": 0,
            "lon": 0
        }
    
    try:
        # Path to the GeoLite2-City.mmdb file
        db_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'GeoLite2-City.mmdb')
        
        if not os.path.exists(db_path):
            return {
                "country": "External",
                "city": "Unknown",
                "lat": 0,
                "lon": 0
            }

        with geoip2.database.Reader(db_path) as reader:
            response = reader.city(ip_address)
            country = response.country.name or "Unknown"
            city = response.city.name or "Unknown"
            lat = response.location.latitude or 0
            lon = response.location.longitude or 0
            return {
                "country": country,
                "city": city,
                "lat": lat,
                "lon": lon
            }
    except Exception as e:
        return {
            "country": "External",
            "city": "Unknown",
            "lat": 0,
            "lon": 0
        }


# Backward compatible function for existing code
def get_location_tuple(ip_address):
    """Returns tuple (country, city) for backward compatibility"""
    result = get_location(ip_address)
    return result["country"], result["city"]
