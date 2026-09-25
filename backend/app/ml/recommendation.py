from typing import List, Dict, Any

def generate_posture_recommendations(findings: List[Dict[str, Any]], risk_score: float) -> List[Dict[str, Any]]:
    """
    Generates a prioritized mitigation roadmap based on identified findings and overall posture score.
    """
    recommendations = []
    seen_rules = set()
    
    # Priority 1: Critical & High findings
    sorted_findings = sorted(
        findings,
        key=lambda x: {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3, "INFO": 4}.get(x.get("severity"), 5)
    )
    
    for f in sorted_findings:
        rule_id = f.get("rule_id", f.get("title"))
        if rule_id in seen_rules:
            continue
        seen_rules.add(rule_id)
        
        recommendations.append({
            "priority": "P1 - Critical Action" if f.get("severity") in ["CRITICAL", "HIGH"] else "P2 - Remediate",
            "title": f.get("title"),
            "severity": f.get("severity"),
            "standard_ref": f.get("standard_ref"),
            "recommendation": f.get("recommendation")
        })
        
    if risk_score < 70.0 and not any(r["title"] == "Global TLS Policy Enforcement" for r in recommendations):
        recommendations.insert(0, {
            "priority": "P0 - Immediate Policy Override",
            "title": "Global TLS Policy Enforcement",
            "severity": "CRITICAL",
            "standard_ref": "NIST SP 800-52 Rev 2 / RFC 8314",
            "recommendation": "Perform an emergency audit of mail transfer agents (MTAs). Enforce TLS 1.2+ minimum, disable cleartext ports, and issue fresh 2048-bit RSA/ECC certificates."
        })
        
    return recommendations
