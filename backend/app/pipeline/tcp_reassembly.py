from typing import Dict, List, Tuple
from dataclasses import dataclass, field
import scapy.all as scapy
from app.pipeline.protocol_id import detect_protocol

@dataclass
class PacketSegment:
    seq: int
    payload: bytes
    direction: str # 'c2s' or 's2c'

@dataclass
class TCPStream:
    stream_id: str
    src_ip: str
    src_port: int
    dst_ip: str
    dst_port: int
    protocol: str
    client_payload: bytes = b""
    server_payload: bytes = b""
    raw_segments: List[PacketSegment] = field(default_factory=list)

def reassemble_pcap(pcap_path: str) -> List[TCPStream]:
    """
    Parses a PCAP/PCAPNG file and reassembles bidirectional TCP streams.
    Supports pure-Python packet parsing via Scapy.
    """
    packets = scapy.rdpcap(pcap_path)
    streams_map: Dict[Tuple[str, int, str, int], TCPStream] = {}

    for pkt in packets:
        if not pkt.haslayer(scapy.IP) or not pkt.haslayer(scapy.TCP):
            continue
            
        ip = pkt[scapy.IP]
        tcp = pkt[scapy.TCP]
        
        payload = bytes(tcp.payload)
        if not payload:
            continue

        src_ip, dst_ip = ip.src, ip.dst
        src_port, dst_port = tcp.sport, tcp.dport
        
        # Canonical key for 5-tuple (smaller IP:port first)
        if (src_ip, src_port) < (dst_ip, dst_port):
            key = (src_ip, src_port, dst_ip, dst_port)
            direction = 'c2s'
        else:
            key = (dst_ip, dst_port, src_ip, src_port)
            direction = 's2c'

        if key not in streams_map:
            client_ip, client_port, server_ip, server_port = key
            proto = detect_protocol(client_port, server_port, payload)
            stream_id = f"{client_ip}:{client_port}-{server_ip}:{server_port}"
            streams_map[key] = TCPStream(
                stream_id=stream_id,
                src_ip=client_ip,
                src_port=client_port,
                dst_ip=server_ip,
                dst_port=server_port,
                protocol=proto
            )

        stream = streams_map[key]
        stream.raw_segments.append(PacketSegment(seq=tcp.seq, payload=payload, direction=direction))
        
        if direction == 'c2s':
            stream.client_payload += payload
        else:
            stream.server_payload += payload
            
        # Re-evaluate protocol if it was UNKNOWN
        if stream.protocol == "UNKNOWN":
            stream.protocol = detect_protocol(stream.src_port, stream.dst_port, payload)

    return list(streams_map.values())
