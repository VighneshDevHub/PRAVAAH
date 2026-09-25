import os
import struct
from pathlib import Path
import scapy.all as scapy

# Save generated PCAPs in backend/fixtures/pcaps
PCAP_DIR = Path(__file__).resolve().parent.parent / "tests" / "fixtures" / "pcaps"
PCAP_DIR.mkdir(parents=True, exist_ok=True)

def build_tcp_packet(src_ip, src_port, dst_ip, dst_port, seq, payload, flags="PA"):
    pkt = scapy.IP(src=src_ip, dst=dst_ip) / scapy.TCP(sport=src_port, dport=dst_port, seq=seq, flags=flags) / payload
    return pkt

def generate_smtp_weak_sslv3_rc4():
    """Generates PCAP with SMTP STARTTLS upgrading to SSLv3 with RC4 cipher."""
    pkts = []
    c_ip, s_ip = "192.168.1.10", "192.168.1.25"
    c_port, s_port = 49152, 25
    
    pkts.append(build_tcp_packet(s_ip, s_port, c_ip, c_port, 100, b"220 mail.enterprise.local ESMTP Postfix\r\n"))
    pkts.append(build_tcp_packet(c_ip, c_port, s_ip, s_port, 200, b"EHLO client.enterprise.local\r\n"))
    pkts.append(build_tcp_packet(s_ip, s_port, c_ip, c_port, 140, b"250-mail.enterprise.local\r\n250-STARTTLS\r\n250 8BITMIME\r\n"))
    pkts.append(build_tcp_packet(c_ip, c_port, s_ip, s_port, 230, b"STARTTLS\r\n"))
    pkts.append(build_tcp_packet(s_ip, s_port, c_ip, c_port, 190, b"220 2.0.0 Ready to start TLS\r\n"))
    
    # TLS ClientHello (SSLv3 = 0x0300)
    ch_payload = b"\x16\x03\x00\x00\x2d\x01\x00\x00\x29\x03\x00" + b"\x00"*32 + b"\x00\x02\x00\x05\x01\x00"
    pkts.append(build_tcp_packet(c_ip, c_port, s_ip, s_port, 240, ch_payload))
    
    # TLS ServerHello (negotiating SSLv3 + RC4 cipher 0x0005)
    sh_payload = b"\x16\x03\x00\x00\x2d\x02\x00\x00\x29\x03\x00" + b"\x00"*32 + b"\x00\x00\x05\x00"
    pkts.append(build_tcp_packet(s_ip, s_port, c_ip, c_port, 220, sh_payload))
    
    file_path = PCAP_DIR / "smtp_weak_sslv3_rc4.pcap"
    scapy.wrpcap(str(file_path), pkts)
    print(f"Generated {file_path}")
    return file_path

def generate_imaps_expired_sha1():
    """Generates PCAP with IMAP Implicit TLS (port 993) presenting expired cert."""
    pkts = []
    c_ip, s_ip = "192.168.1.11", "192.168.1.99"
    c_port, s_port = 49153, 993
    
    ch_payload = b"\x16\x03\x03\x00\x30\x01\x00\x00\x2c\x03\x03" + b"\x11"*32 + b"\x00\x02\x00\x2f\x01\x00"
    pkts.append(build_tcp_packet(c_ip, c_port, s_ip, s_port, 100, ch_payload))
    
    sh_payload = b"\x16\x03\x03\x00\x30\x02\x00\x00\x2c\x03\x03" + b"\x22"*32 + b"\x00\x00\x2f\x00"
    pkts.append(build_tcp_packet(s_ip, s_port, c_ip, c_port, 200, sh_payload))
    
    file_path = PCAP_DIR / "imaps_expired_sha1.pcap"
    scapy.wrpcap(str(file_path), pkts)
    print(f"Generated {file_path}")
    return file_path

def generate_pop3_starttls_downgrade():
    """Generates PCAP with POP3 STARTTLS stripping and plaintext credentials."""
    pkts = []
    c_ip, s_ip = "192.168.1.12", "192.168.1.110"
    c_port, s_port = 49154, 110
    
    pkts.append(build_tcp_packet(s_ip, s_port, c_ip, c_port, 100, b"+OK POP3 Server Ready <mail@enterprise.local>\r\n"))
    pkts.append(build_tcp_packet(c_ip, c_port, s_ip, s_port, 200, b"STLS\r\n"))
    pkts.append(build_tcp_packet(s_ip, s_port, c_ip, c_port, 150, b"-ERR STLS not supported\r\n"))
    pkts.append(build_tcp_packet(c_ip, c_port, s_ip, s_port, 210, b"USER admin@enterprise.local\r\n"))
    pkts.append(build_tcp_packet(s_ip, s_port, c_ip, c_port, 180, b"+OK Password required\r\n"))
    pkts.append(build_tcp_packet(c_ip, c_port, s_ip, s_port, 240, b"PASS SuperSecret123!\r\n"))
    
    file_path = PCAP_DIR / "pop3_starttls_downgrade.pcap"
    scapy.wrpcap(str(file_path), pkts)
    print(f"Generated {file_path}")
    return file_path

def generate_smtp_hardened_tls13():
    """Generates PCAP with SMTP STARTTLS upgrading to TLS 1.3 with PFS."""
    pkts = []
    c_ip, s_ip = "192.168.1.13", "192.168.1.25"
    c_port, s_port = 49155, 587
    
    pkts.append(build_tcp_packet(s_ip, s_port, c_ip, c_port, 100, b"220 mail.secure.gov ESMTP\r\n"))
    pkts.append(build_tcp_packet(c_ip, c_port, s_ip, s_port, 200, b"EHLO secure.client\r\n"))
    pkts.append(build_tcp_packet(s_ip, s_port, c_ip, c_port, 130, b"250-mail.secure.gov\r\n250 STARTTLS\r\n"))
    pkts.append(build_tcp_packet(c_ip, c_port, s_ip, s_port, 220, b"STARTTLS\r\n"))
    pkts.append(build_tcp_packet(s_ip, s_port, c_ip, c_port, 160, b"220 2.0.0 Ready to start TLS\r\n"))
    
    # ClientHello
    ch_payload = b"\x16\x03\x03\x00\x30\x01\x00\x00\x2c\x03\x03" + b"\x33"*32 + b"\x00\x02\x13\x01\x01\x00"
    pkts.append(build_tcp_packet(c_ip, c_port, s_ip, s_port, 230, ch_payload))
    
    # ServerHello TLS 1.3 with cipher 0x1301 (TLS_AES_128_GCM_SHA256)
    sh_payload = b"\x16\x03\x03\x00\x30\x02\x00\x00\x2c\x03\x03" + b"\x44"*32 + b"\x00\x13\x01\x00"
    pkts.append(build_tcp_packet(s_ip, s_port, c_ip, c_port, 200, sh_payload))
    
    file_path = PCAP_DIR / "smtp_hardened_tls13.pcap"
    scapy.wrpcap(str(file_path), pkts)
    print(f"Generated {file_path}")
    return file_path

def generate_all_synthetic_pcaps():
    generate_smtp_weak_sslv3_rc4()
    generate_imaps_expired_sha1()
    generate_pop3_starttls_downgrade()
    generate_smtp_hardened_tls13()
    print("All synthetic PCAPs successfully generated.")

if __name__ == "__main__":
    generate_all_synthetic_pcaps()
