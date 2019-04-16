package importacsv.entidade;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;
import br.com.edu.framework.modelo.GenericEntity;

/**
 * @author eduardo.andrade
 * @since 18/08/2014
 */

@NamedQueries({

    @NamedQuery(name="importa.pesquisarComUF", query="SELECT pv FROM PocoValidacao pv"
        + " WHERE pv.situacaoRegistro = :situacao AND pv.uf = :uf ORDER BY pv.uf"),

    @NamedQuery(name="importa.pesquisarSemUF",query="SELECT pv FROM PocoValidacao pv"
        + " WHERE pv.situacaoRegistro = :situacao ORDER BY pv.uf"),

    @NamedQuery(name="importa.pesquisarPocoPeloArgumentoFederal", query="SELECT pv FROM PocoValidacao pv"
        + " WHERE pv.situacaoRegistro = :situacao AND (pv.municipio LIKE :argumentoLike "
        + " OR pv.nomeProprietario LIKE :argumentoLike)"),

    @NamedQuery(name="importa.pesquisarPocoPeloArgumento", query="SELECT pv FROM PocoValidacao pv"
        + " WHERE pv.situacaoRegistro = :situacao AND pv.uf = :uf AND (pv.municipio LIKE :argumentoLike "
        + " OR pv.nomeProprietario LIKE :argumentoLike)"),

    @NamedQuery(name="importa.contarPoco", query="SELECT COUNT(*) FROM PocoValidacao pv"
        + " WHERE pv.situacaoRegistro = :situacao"),

    @NamedQuery(name="importa.contarPocoPorPonto", query="SELECT COUNT(*) FROM PocoValidacao pv"
        + " WHERE pv.ponto = :ponto"),

    @NamedQuery(name="importa.contarPorArgumentoSituacao", query="SELECT COUNT(*) FROM PocoValidacao pv"
        + " WHERE pv.situacaoRegistro = :situacao AND (pv.cpfCnpj = :argumento OR pv.municipio LIKE :argumentoLike "
        + " OR pv.nomeProprietario LIKE :argumentoLike OR pv.ponto LIKE :argumentoLike)"),

    @NamedQuery(name="importa.contarPorUFSituacao", query="SELECT COUNT(*) FROM PocoValidacao pv"
        + " WHERE pv.situacaoRegistro = :situacao AND pv.uf = :uf "),

    @NamedQuery(name="importa.contarPorPontoUFSituacao", query="SELECT COUNT(*) FROM PocoValidacao pv"
        + " WHERE pv.uf = :uf AND pv.situacaoRegistro = :situacao AND pv.ponto = :argumento"),

    @NamedQuery(name="importa.contarPorPontoSituacao", query="SELECT COUNT(*) FROM PocoValidacao pv"
        + " WHERE pv.situacaoRegistro = :situacao AND pv.ponto = :argumento"),

    @NamedQuery(name="importa.contarPorArgumentoUFSituacao", query="SELECT COUNT(*) FROM PocoValidacao pv"
        + " WHERE pv.uf = :uf AND pv.situacaoRegistro = :situacao AND (pv.cpfCnpj = :argumento"
        + " OR pv.municipio LIKE :argumentoLike OR pv.nomeProprietario LIKE :argumentoLike)"),

    @NamedQuery(name="importa.PesquisarProprietario", query="SELECT pv FROM PocoValidacao pv"
        + " WHERE pv.cpfCnpj = :cpfCnpj"),

    @NamedQuery(name="importa.recuperarMaxIdProprietario", query="SELECT MAX(pv.idProprietario) FROM PocoValidacao pv"),
})

@Entity
@Table(name = "RGLTB_POCO_VALIDACAO")
@SequenceGenerator(name="SEQINT", sequenceName="PK_RGLTB_POCO_VALIDACAO", initialValue=1, allocationSize=1)
public class PocoValidacao extends GenericEntity<Long> {

    private static final long serialVersionUID = -2737085090175395109L;

    @Id
    @Getter @Setter
    @Column(name = "ID_POCO")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SEQINT")
    private Long id;

    @Getter @Setter
    @Column(name = "PONTO")
    private Long ponto;

    @Getter @Setter
    @Column(name = "DATA_INSTALACAO")
    private  Date dataInstalacao;

    @Getter @Setter
    @Column(name = "COTA_TERRENO")
    private Double cotaTerreno;

    @Getter @Setter
    @Column(name = "LATITUDE")
    private Double latitude;

    @Getter @Setter
    @Column(name = "LONGITUDE")
    private Double longitude;

    @Getter @Setter
    @Column(name = "UTME")
    private Integer utme;

    @Getter @Setter
    @Column(name = "UTMN")
    private Integer utmn;

    @Getter @Setter
    @Column(name = "MUNICIPIO")
    private String municipio;

    @Getter @Setter
    @Column(name = "UF")
    private String uf;

    @Getter @Setter
    @Column(name = "PROJETO")
    private String projeto;

    @Getter @Setter
    @Column(name = "NATUREZA")
    private String natureza;

    @Getter @Setter
    @Column(name = "SITUACAO")
    private String situacao;

    @Getter @Setter
    @Column(name = "USO_AGUA")
    private String usoAgua;

    @Getter @Setter
    @Column(name = "METODO_PERFURACAO")
    private String metodoPerfuracao;

    @Getter @Setter
    @Column(name = "TOPO")
    private Double topo;

    @Getter @Setter
    @Column(name = "BASE")
    private Double base;

    @Getter @Setter
    @Column(name = "TIPO_PENETRACAO")
    private String tipoPenetracao;

    @Getter @Setter
    @Column(name = "CONDICAO")
    private String condicao;

    @Getter @Setter
    @Column(name = "PROFUNDIDADE_INICIAL")
    private Double profundidadeInicial;

    @Getter @Setter
    @Column(name = "PROFUNDIDADE_FINAL")
    private Double profundidadeFinal;

    @Getter @Setter
    @Column(name = "TIPO_FORMACAO")
    private String tipoFormacao;

    @Getter @Setter
    @Column(name = "DATA_TESTE")
    private  Date dataTeste;

    @Getter @Setter
    @Column(name = "TIPO_TESTE_BOMBEAMENTO")
    private String tipoTesteBombeamento;

    @Getter @Setter
    @Column(name = "METODO_INTERPRETACAO")
    private String metodoInterpretacao;

    @Getter @Setter
    @Column(name = "UNIDADE_DE_BOMBEAMENTO")
    private String unidadeBombeamento;

    @Getter @Setter
    @Column(name = "NIVEL_DINAMICO")
    private Double nivelDinamico;

    @Getter @Setter
    @Column(name = "NIVEL_ESTATICO")
    private Double nivelEstatico;

    @Getter @Setter
    @Column(name = "VAZAO_ESPECIFICA")
    private Double vazaoEspecifica;

    @Getter @Setter
    @Column(name = "COEFICIENTE_ARMAZENAMENTO")
    private Double coeficienteArmazenamento;

    @Getter @Setter
    @Column(name = "VAZAO_LIVRE")
    private Double vazaoLivre;

    @Getter @Setter
    @Column(name = "PERMEABILIDADE")
    private Float permeabilidade;

    @Getter @Setter
    @Column(name = "TRANSMISSIVIDADE")
    private Float transmissividade;

    @Getter @Setter
    @Column(name = "VAZAO_ESTABILIZACAO")
    private Double vazaoEstabilizacao;

    @Getter @Setter
    @Column(name = "DATA_ANALISE")
    private  Date dataAnalise;

    @Getter @Setter
    @Column(name = "DATA_COLETA")
    private  Date dataColeta;

    @Getter @Setter
    @Column(name = "CONDUTIVIDADE_ELETRICA")
    private Double condutividadeEletrica;

    @Getter @Setter
    @Column(name = "COR")
    private Double cor;

    @Getter @Setter
    @Column(name = "ODOR")
    private String odor;

    @Getter @Setter
    @Column(name = "SABOR")
    private String sabor;

    @Getter @Setter
    @Column(name = "TEMPERATURA")
    private Double temperatura;

    @Getter @Setter
    @Column(name = "TURBIDEZ")
    private Double turbidez;

    @Getter @Setter
    @Column(name = "SOLIDOS_SEDIMENTAVEIS")
    private Double solidosSedimentaveis;

    @Getter @Setter
    @Column(name = "SOLIDOS_SUSPENSOS")
    private Double solidosSuspensos;

    @Getter @Setter
    @Column(name = "SITUACAO_REGISTRO")
    private Integer situacaoRegistro;

    @Getter @Setter
    @Column(name = "ID_PROPRIETARIO")
    private Long idProprietario;

    @Getter @Setter
    @Column(name = "CPF_CNPJ_PROPRIETARIO")
    private String cpfCnpj;

    @Getter @Setter
    @Column(name = "TIPO_CPF_CNPJ")
    private Integer tipoCpfCnpj;

    @Getter @Setter
    @Column(name = "NOME_PROPRIETARIO")
    private String nomeProprietario;

    @Getter @Setter
    @Column(name = "CEP_PROPRIETARIO")
    private Long cepProprietario;

    @Getter @Setter
    @Column(name = "ENDERECO_PROPRIETARIO")
    private String enderecoProprietario;

    @Getter @Setter
    @Column(name = "BAIRRO_PROPRIETARIO")
    private String bairroProprietario;

    @Getter @Setter
    @Column(name = "UF_PROPRIETARIO")
    private String ufProprietario;

    @Getter @Setter
    @Column(name = "MUNICIPIO_PROPRIETARIO")
    private String municipioProprietario;

    @Getter @Setter
    @Column(name = "TELEFONE_PROPRIETARIO")
    private String telefoneProprietario;

    @Getter @Setter
    @Column(name = "FAX_PROPRIETARIO")
    private String faxProprietario;

    @Getter @Setter
    @Column(name = "CELULAR_PROPRIETARIO")
    private String celularProprietario;

    @Getter @Setter
    @Column(name = "DADOS_ORIGEM")
    private String dadosOrigem;

    @Getter @Setter
    @Column(name = "MUN_UFD_CD")
    private String municipioCruzamento;

    @Getter @Setter
    @Column(name = "PAI_CD")
    private String paisCruzamento;

    @Getter @Setter
    @Column(name = "RHI_CD")
    private String regiaoHidrograficaCruzamento;

    @Getter @Setter
    @Column(name = "UFD_CD")
    private String estadoCruzamento;

    @Getter @Setter
    @Column(name = "UHE_CD")
    private String unidadeGestaoEstadualCruzamento;

    @Getter @Setter
    @Column(name = "UHI_CD")
    private String unidadeHidrograficaCruzamento;

    @Getter @Setter
    @Column(name = "UPH_CD")
    private String unidadeGestaoLocalCruzamento;

    @Getter @Setter
    @Column(name = "OBA_CD")
    private String ottobaciaCruzamento;

    @Getter @Setter
    @Column(name = "CD_SISTEMA_AQUIFERO")
    private String aquiferoCruzamento;

    @Getter @Setter
    @Column(name = "COD_ERRO_NAO_SINCRONIZADO")
    private String codigoErroNaoSincronizado;

    @ManyToOne
    @Getter @Setter
    @JoinColumn(name = "PVA_TFN_CD")
    private TipoFinalidade tipoFinalidade;

    @ManyToOne
    @Getter @Setter
    @JoinColumn(name = "PVA_TSA_CD")
    private TipoSituacaoAto tipoSituacaoAto;

    @ManyToOne
    @Getter @Setter
    @JoinColumn(name = "PVA_STI_CD")
    private TipoSituacaoInterferencia tipoSituacaoInterferencia;

    @Getter @Setter
    @Column(name = "PVA_DS_ATO")
    private String descricaoAto;

    @Getter @Setter
    @Column(name = "PVA_NU_ATO")
    private String numeroAto;

    @Getter @Setter
    @Column(name = "PVA_DATA_INICIO_AUTORIZACAO")
    private Date dataInicioAutorizacao;

    @Getter @Setter
    @Column(name = "PVA_DATA_FINAL_AUTORIZACAO")
    private Date dataFinalAutorizacao;

    @Getter @Setter
    @Column(name = "PVA_VAZAO_MEDIA")
    private Double vazaoMedia;

    @Getter @Setter
    @Column(name = "PVA_TEMPO_HORA_DIA")
    private Integer tempoHoraDia;

    @Getter @Setter
    @Column(name = "PVA_TEMPO_DIA_MES")
    private Integer tempoDiaMes;

    @ManyToOne
    @Getter @Setter
    @JoinColumn(name = "PVA_TAT_CD")
    private TipoAto tipoAto;

    @ManyToOne
    @Getter @Setter
    @JoinColumn(name = "PVA_TSI_CD")
    private TipoSistemaIrrigacao tipoSistemaIrrigacao;

    @ManyToOne
    @Getter @Setter
    @JoinColumn(name = "PVA_TCT_CD")
    private TipoCultura tipoCultura;

    @Getter @Setter
    @Column(name = "PVA_AREAIRRIGADA")
    private Double areaIrrigada;
}
