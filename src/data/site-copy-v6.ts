export interface SiteCopyTypeV6 {
  guan: {
    label: string;
    epigraph: string;
    attribution: string;
    footer_line: string;
  };
  wordmark: string;
  hero_left: {
    h1: string;
    sub: string;
    cta_1: string;
    cta_2: string;
  };
  hero_center: {
    h1: string;
    body: string;
  };
  fde_annotation: {
    body: string;
  };
  panel_keep: {
    h: string;
    body: string;
    form_note: string;
  };
  shift: {
    label: string;
    h: string;
    stat_strip?: string;
    body: string;
    stepper: string;
  };
  stance: {
    line: string;
  };
  moats: {
    label: string;
    card_1: string;
    card_2: string;
    card_3: string;
    card_4: string;
    routing_strip: string;
  };
  dev_smithy: {
    label: string;
    h: string;
    chart?: string;
    body: string;
    cta: string;
  };
  operators: {
    label: string;
    h: string;
    body: string;
    anchor?: string;
    cta: string;
  };
  workforce_rail: {
    h: string;
    items: string;
    discipline_line?: string;
  };
  footer: {
    closing: string;
  };
  bios_locale: {
    label: string;
    options: string;
  };
}
