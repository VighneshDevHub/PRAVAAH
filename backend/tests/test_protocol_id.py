from app.pipeline.protocol_id import detect_protocol, identify_protocol_by_port, identify_protocol_by_banner

def test_identify_protocol_by_port():
    assert identify_protocol_by_port(25) == "SMTP"
    assert identify_protocol_by_port(587) == "SMTP"
    assert identify_protocol_by_port(465) == "SMTP"
    assert identify_protocol_by_port(143) == "IMAP"
    assert identify_protocol_by_port(993) == "IMAP"
    assert identify_protocol_by_port(110) == "POP3"
    assert identify_protocol_by_port(995) == "POP3"
    assert identify_protocol_by_port(8080) is None

def test_identify_protocol_by_banner():
    assert identify_protocol_by_banner(b"220 mail.domain.com ESMTP Postfix\r\n") == "SMTP"
    assert identify_protocol_by_banner(b"* OK IMAP4rev1 Server Ready\r\n") == "IMAP"
    assert identify_protocol_by_banner(b"+OK POP3 Server Ready\r\n") == "POP3"
    assert identify_protocol_by_banner(b"HTTP/1.1 200 OK\r\n") is None

def test_detect_protocol():
    assert detect_protocol(49152, 25) == "SMTP"
    assert detect_protocol(8080, 8081, b"220 custom.mail.server ESMTP\r\n") == "SMTP"
    assert detect_protocol(1234, 5678, b"UNKNOWN PAYLOAD") == "UNKNOWN"
